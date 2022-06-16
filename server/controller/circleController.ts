import {CallbackError, Mongoose, Types} from 'mongoose';
var mongoose = require('mongoose');
import express, {Request, Response} from 'express';
import Circle from '../models/Circle';
import User from '../models/User';
import {ICircle, IUser} from '../types';
import {
  findCircleById,
  findUserById,
  initiateCredit,
  initiateDebit,
  startRoundDeductionsCron,
  isCircleOwner,
  isMember,
  startRound,
  unsubscribeFromTopics,
  subscribeToTopics
} from '../utils/helpers';
import Wallet from '../models/Wallet';
import moment from 'moment';
var cron = require('node-cron');

const createCircle = async (req: Request, res: Response) => {
  const {circlename, roundDuration, capacity} = req.body;
  const {_id}: any = req.user;

  req.body['_creator'] = _id;

  try {
    const circle = await Circle.findOne({circlename});
    if (circle) {
      res.status(400).json({
        message: {
          body: 'A circle with this name already exists',
          error: false,
        },
      });
    } else {
      const object: any = {};
      const walletObject = {parent: 'circle'};
      const circle = new Circle(req.body);
      object._id = _id;
      object.warnings = 0;
      object.deactivated = false;
      object.trials = 0;
      object.paid = false;
      object.walletId = req.user.walletId;

      circle.round = {
        ...circle.round,
        duration: roundDuration,
        lastRoundEndDate: new Date(),
      };
      circle.members.push(object);
      req.user.circles.push(circle._id);
      req.user.topics.push(circle._id.toString());
      const token = [];
      token.push(req.user.token);
      subscribeToTopics(token, circle._id);
      await circle.save();
      await req.user.save();
      return res.status(200).json({circle});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message: {body: 'An error occured', error: true}});
  }
};

const getCirclesByUser = async (req: Request, res: Response) => {
  const {_id}: any = req.user;
  try {
    const user = await User.findOne({_id: _id}).populate('circles').exec();
    if (user) {
      res.status(200).json({circles: user.circles});
    }
  } catch (error) {
    res.status(500).json({message: {body: 'An error occured', error: true}});
  }
};

const getCircleById = async (req: Request, res: Response) => {
  const {id} = req.params;
  const nextFundedMember = async (index: number, circle: ICircle) => {
    const member = await User.findById({_id: circle.round.funding[index]});
    return `${member?.firstname} ${member?.lastname}`;
  };

  try {
    const circle = await Circle.findOne({_id: mongoose.Types.ObjectId(id)});
    if (circle) {
      if (circle.round.funding.length > 0) {
        circle.round.fundingNow = await nextFundedMember(0, circle);
        circle.round.fundingNext = await nextFundedMember(1, circle);
      }
      res.status(200).json({circle});
    } else {
      res.status(404).json({message: {body: 'Circle not found', error: true}});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message: {body: 'An error occured', error: true}});
  }
};

const deleteCircle = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {circles}: any = req.user;
  try {
    const circle = await findCircleById(id);
    if (circle) {
      const tkns: String[] = [];
      circle?.members.forEach(async member => {
        const user = await findUserById(member._id);
        if (user) {
          user?.circles.forEach(async (circleId, idx) => {
            if (circleId.toString() === id) {
              tkns.push(user.token);
              user.circles.splice(idx, 1);
              await user.save();
            }
          });
        } else {
          res
            .status(404)
            .json({message: {body: 'User not found', error: true}});
        }
      });
      const circledeleted = await Circle.findByIdAndDelete({_id: id});
      if (circledeleted) {
        unsubscribeFromTopics(tkns, circle._id);
        res.status(200).json({
          message: {body: 'Circle deleted successfully!', error: false},
        });
      }
    } else {
      res.status(404).json({message: {body: 'Circle not found', error: true}});
    }
  } catch (error) {
    res.status(500).json({message: {body: 'An error occured', error: true}});
  }
};

const updateCircle = async (req: Request, res: Response) => {
  // const params = Object.keys(ICircle)

  const {id} = req.params;

  try {
    const circleObject = {...req.body};
    const circle = await Circle.findOneAndUpdate(
      {_id: id},
      {$set: circleObject},
      {new: true, runValidators: true},
    );
    if (circle) {
      res.status(200).json({circle});
    } else {
      res.status(404).json({message: {body: 'Circle not found', error: true}});
    }
  } catch (error) {
    res.status(500).json({message: {body: 'An error occured', error: true}});
  }
};

const startAjo = async (req: Request, res: Response) => {
  const {id} = req.params;
  try {
    const circle = await findCircleById(id);
    //start cronjob to run on deduction timer
    if (circle) {
      circle.started = true;
      circle.members.forEach(member => {
        circle.round.funding.push(member._id);
      });
      const exp = moment(new Date())
        .add(circle.round.duration * circle.capacity, 'seconds')
        .format();
      circle.expires = new Date(exp);
      circle.round.lastRoundEndDate = new Date();
      await circle.save();

      await startRound(circle);

      res.status(200).json({
        message: {
          body: 'Ajo started successfully',
          error: false,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: {
        body: 'An error occured.',
        error: true,
      },
    });
  }
};

const triggerPayment = async (req: Request, res: Response) => {
  const {id} = req.params;
  const {_id, walletId} = req.user;
  try {
    const circle = await findCircleById(id);
    if (circle) {
      const memberObject = await isMember(_id, circle);
      if (memberObject.exists) {
        if (!memberObject.member?.paid) {
          const isDebitSuccessful = await initiateDebit(
            walletId,
            circle.fee,
            circle._id,
            'circle',
          );

          if (
            !isDebitSuccessful?.insufficient &&
            isDebitSuccessful?.initiatorExists
          ) {
            circle.members.forEach(mem => {
              if (mem._id.toString() == _id) {
                mem.paid = true;
              }
            });
            await circle.save();
            res.status(200).json({
              message: {
                body: 'You have successfully paid for this round.',
                error: false,
              },
            });
          } else {
            res.status(400).json({
              message: {
                body: 'You do not have sufficient balance in your ajo wallet.',
                error: false,
              },
            });
          }
        } else {
          res.status(400).json({
            message: {
              body: 'You have already been charged for this round.',
              error: true,
            },
          });
        }
      } else {
        res.status(400).json({
          message: {
            body: 'You are not a member of this circle.',
            error: true,
          },
        });
      }
    } else {
      res.status(400).json({
        message: {
          body: 'This circle does not exist.',
          error: true,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: {
        body: 'An error occured.',
        error: true,
      },
    });
  }
};

const leaveCircle = async (req: Request, res: Response) => {
  const {_id, circles, token} = req.user;
  const {id} = req.params;
  const circle = await findCircleById(id);

  if (circle) {
    const memberObject = await isMember(_id, circle);
    console.log(memberObject);
    if (memberObject.exists) {
      if (await isCircleOwner(circle, _id)) {
        res.status(200).json({
          message: {
            body: 'You cannot leave a circle you created.',
            error: true,
          },
        });
      } else {
        const tkn = [];
        tkn.push(token);
        unsubscribeFromTopics(tkn, circle._id);
        // //delete circle on member end
        req.user.circles.forEach(async (circleId: any, idx: any) => {
          if (circleId.toString() === id) {
            circles.splice(idx, 1);
          }
        });
        //delete member on circle end
        circle.members.forEach(async (member, idx) => {
          if (member._id === _id.toString()) {
            circle.members.splice(idx, 1);
          }
        });
        req.user.topics.forEach((topic, idx) => {
          if (topic === circle._id.toString()) {
            req.user.topics.splice(idx, 1);
          }
        });

        await req.user.save();
        await circle.save();
        res.status(200).json({
          message: {
            body: 'You have successfully left this circle.',
            error: false,
          },
        });
      }
    } else {
      res.status(404).json({
        message: {body: 'You are not a member of this circle.', error: true},
      });
    }
  } else {
    res.status(404).json({
      message: {body: 'This circle does not exist.', error: true},
    });
  }
};

const activateMember = async (req: Request, res: Response) => {
  const {circleId, userId} = req.params;
  const {_id} = req.user;
  try {
    const circle = await findCircleById(circleId);
    const user = await findUserById(userId);
    if (circle && user) {
      if (await isCircleOwner(circle, _id)) {
        await Circle.findOneAndUpdate(
          {_id: circleId, 'members._id': userId},
          {$set: {'members.$.deactivated': false}},
        );
        res.status(200).json({
          message: {
            body: `${user.firstname} has been activated.`,
            error: false,
          },
        });
      } else {
        res.status(400).json({
          message: {
            body: 'You are not authorized to activate this member.',
            error: true,
          },
        });
      }
    } else {
      res.status(404).json({
        message: {
          body: 'This user or circle does not exist.',
          error: true,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: {
        body: 'An error occured.',
        error: true,
      },
    });
  }
};

const deactivateMember = async (req: Request, res: Response) => {
  const {circleId, userId} = req.params;
  const {_id} = req.user;

  try {
    const circle = await findCircleById(circleId);
    const user = await findUserById(userId);
    if (circle && user) {
      if (await isCircleOwner(circle, _id)) {
        await Circle.findOneAndUpdate(
          {_id: circleId, 'members._id': userId},
          {$set: {'members.$.deactivated': true}},
        );
        res.status(200).json({
          message: {
            body: `${user.firstname} has been deactivated.`,
            error: false,
          },
        });
      } else {
        res.status(400).json({
          message: {
            body: 'You are not authorized to deactivate this member.',
            error: true,
          },
        });
      }
    } else {
      res.status(404).json({
        message: {
          body: 'This user or circle does not exist.',
          error: true,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: {
        body: 'An error occured.',
        error: true,
      },
    });
  }
};

const warnMember = async (req: Request, res: Response) => {
  const {circleId, userId} = req.params;
  const {_id} = req.user;
  const maxWarnings = 2;

  try {
    const circle = await findCircleById(circleId);
    const user = await findUserById(userId);
    if (circle && user) {
      const memberObject = await isMember(_id, circle);
      if (await isCircleOwner(circle, _id)) {
        if (memberObject.exists) {
          const updated = await Circle.findOneAndUpdate(
            {
              _id: circleId,
              members: {
                $elemMatch: {warnings: {$lt: maxWarnings}, _id: userId},
              },
            },
            {$inc: {'members.$.warnings': 1}},
          );
          if (updated) {
            res.status(200).json({
              message: {
                body: `${user.firstname} has been issued a warning.`,
                error: false,
              },
            });
          } else {
            res.status(200).json({
              message: {
                body: `${user.firstname} has reached a maximum warning limit and is already deactivated.`,
                error: false,
              },
            });
          }
        } else {
          res.status(400).json({
            message: {
              body: 'This user is not a member of your circle.',
              error: true,
            },
          });
        }
      } else {
        res.status(400).json({
          message: {
            body: 'You are not authorized to issue this member a warning.',
            error: true,
          },
        });
      }
    } else {
      res.status(404).json({
        message: {
          body: 'This user or circle does not exist.',
          error: true,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: {
        body: 'An error occured.',
        error: true,
      },
    });
  }
};

module.exports = {
  createCircle,
  getCirclesByUser,
  getCircleById,
  deleteCircle,
  updateCircle,
  leaveCircle,
  activateMember,
  deactivateMember,
  warnMember,
  startAjo,
  triggerPayment,
};
