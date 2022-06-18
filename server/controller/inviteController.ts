import {CallbackError} from 'mongoose';
import express, {Request, Response} from 'express';
import Circle from '../models/Circle';
import JWT from 'jsonwebtoken';
import User from '../models/User';
import {ICircle, IUser} from '../types';
import sendEmail from '../config/email';
import {ExtractJwt} from 'passport-jwt';
import endpointsConfig from '../endpoints.config';
import {
  jwtExtractor,
  isCircleOwner,
  isInvited,
  findCircleById,
  addMember,
  isMember,
  findUserById,
  sendNotification,
} from '../utils/helpers';
import Wallet from '../models/Wallet';

const sendInvite = async (req: Request, res: Response) => {
  const {id, circleid} = req.body;
  const {_id, firstname, lastname}: any = req.user;
  try {
    const user = await findUserById(id);
    const circle = await findCircleById(circleid);
    const token = jwtExtractor(req);

    const isOnboarding = async (
      walletId: string,
      fn: string | undefined | null,
      ln: string | undefined | null,
      dob: Date,
    ) => {
      const wallet = await Wallet.findById({_id: walletId});
      const todo = [];
      if (wallet) {
        if (
          wallet.bankdetails &&
          wallet.bankdetails.bankcode &&
          wallet.bankdetails
        ) {
        } else {
          todo.push(1);
        }

        if (wallet.bankdetails && wallet.bankdetails.authorization) {
        } else {
          todo.push(1);
        }

        if (fn && ln && dob) {
        } else {
          todo.push(1);
        }
      }

      return todo.length > 0;
    };

    if (user && circle) {
      const memberObject = await isMember(id, circle);
      if (memberObject.exists) {
        return res.status(200).json({
          message: {
            body: `This user is already a member of ${circle.circlename}`,
            error: true,
          },
        });
      } else {
        if (await isCircleOwner(circle, _id)) {
          const inviteExists = circle.invites.some(
            invitee => invitee.toString() == user._id.toString(),
          );

          const onBoarding = await isOnboarding(
            user.walletId,
            user.firstname,
            user.lastname,
            //@ts-ignore
            user.dob,
          );
          if (user.token && !onBoarding) {
            const tkn: any = [];
            tkn.push(user.token);
            if (!inviteExists) {
              circle.invites.push(user._id);
            }

            const authToken = signToken(user._id);

            await circle.save();
            const inviteLink = `ajo://app/invite/${authToken}/${circle._id}/${user._id}`;
            console.log(inviteLink)
            const sent = await sendEmail({
              from: 'help@getajo.app',
              to: `${user.email}`,
              subject: `${firstname} ${lastname} (Ajo Circle Invite)`,
              templateName: 'invite',
              templateVars: {
                token: token,
                recepientName: `${user.firstname}`,
                senderName: `${firstname}`,
                circleName: `${circle.circlename}`,
                inviteLink: inviteLink,
              },
            });

            user.notifications.push({
              title: `Invitation from ${circle.circlename}`,
              content: `You just got an invite to join an ajo (${circle.circlename}). Check your email to accept this invite`,
              createdAt: new Date(),
            });
            sendNotification(
              'user',
              `Invitation from ${circle.circlename}`,
              `You just got an invite to join an ajo (${circle.circlename}). Check your email to accept this invite`,
              tkn,
            );

            await user.save();
            if (sent) {
              res.status(200).json({
                message: {
                  body: 'Invite successfully sent',
                  circle: circle,
                  error: false,
                },
              });
            } else {
              res.status(500).json({
                message: {
                  body: 'We cannot send your invite at this time, please try again later.',
                  error: true,
                },
              });
            }
          } else {
            return res.status(400).json({
              message: {
                body: 'This user needs to finish their ajo registration before they can join your circle',
                error: true,
              },
            });
          }
        } else {
          res.status(400).json({
            message: {
              body: 'You are not authorized to invite this user',
              error: false,
            },
          });
        }
      }
    } else {
      res.status(400).json({
        message: {
          body: 'User or circle does not exist',
          error: false,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message: {body: 'An error occured', error: true}});
  }
};

const searchUsersToInvite = async (req: Request, res: Response) => {
  const {query}: any = req.query;
  try {
    const users = await User.find({
      username: {$regex: query, $options: 'i'},
    });

    if (users) {
      res.status(200).json({users});
    } else {
      res.status(200).json({message: {body: 'User not found', error: false}});
    }
  } catch (error) {
    res.status(500).json({message: {body: 'An error occured', error: true}});
  }
};

const acceptInvite = async (req: Request, res: Response) => {
  const {userId, circleId}: any = req.params;
  try {
    const circle = await findCircleById(circleId);
    const user = await findUserById(userId);
    //trying to validate if user exists and if is authorized to accept invite
    const userAuthorized = () => {
      const authorized = user && req.user._id.toString() === userId;
      return authorized;
    };

    if (circle && user) {
      if (userAuthorized()) {
        const memberObject = await isMember(userId, circle);
        if (memberObject.exists) {
          return res.status(200).json({
            message: {
              body: `You are already a member of ${circle.circlename}`,
              error: true,
            },
          });
        }
        if (await isInvited(userId, circle)) {
          if (circle.members.length < circle.capacity) {
            await addMember(userId, circle, user);
            // if (circle.members.length == circle.capacity) {

            // }
          } else {
            return res.status(400).json({
              message: {
                body: 'This circle is already full',
                error: true,
              },
            });
          }

          user.circles.push(circle._id);
          user.topics.push(circle._id.toString());
          await user.save();
          await circle.save();
          return res.status(200).json({
            message: {
              body: `You are now a member of ${circle.circlename}`,
              circle: circle,
              error: true,
            },
          });
        } else {
          res.status(400).json({
            message: {
              body: 'You were not invited into this circle',
              error: true,
            },
          });
        }
      } else {
        res.status(400).json({
          message: {
            body: 'You were not invited into this circle',
            error: true,
          },
        });
      }
    } else {
      res.status(400).json({
        message: {
          body: 'Invalid credentials, ask for another invite :)',
          error: true,
        },
      });
    }
  } catch (error) {
    res.status(500).json({message: {body: 'An error occured', error: true}});
  }
};

const signToken = (userID: string) => {
  return JWT.sign(
    {
      iss: 'ajo',
      sub: userID,
    },
    endpointsConfig.jwtSecret,
    {expiresIn: '1h'},
  );
};

module.exports = {
  sendInvite,
  searchUsersToInvite,
  acceptInvite,
};
