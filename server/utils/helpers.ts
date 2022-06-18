import {Request} from 'express';
import Circle from '../models/Circle';
import User from '../models/User';
import Wallet from '../models/Wallet';
import sendEmail from '../config/email';
import moment from 'moment';
import {ICircle, IUser, IWallet, Members} from '../types';
import axios from 'axios';
import endpointsConfig from '../endpoints.config';

const {uuid} = require('uuidv4');
var cron = require('node-cron');
var admin = require('firebase-admin');
var serviceAccount = require('./ajo-f1b9b-firebase-adminsdk-dgjl0-58d38b8923.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ajo-f1b9b.firebaseio.com',
});

const sendNotification = (
  type: String,
  title: String,
  body: String,
  t: any,
) => {
  if (type == 'user') {
    var message: any = {
      notification: {
        title: title,
        body: body,
      },
      data: {},
      android: {
        notification: {
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
      tokens: t,
    };

    admin
      .messaging()
      .sendMulticast(message)
      .then((response: any) => {
        console.log('successfully sent push', response);
      })
      .catch((error: any) => {
        console.log('>>>>>>>>>>>>>>>>>>>>', message);
        console.log(error);
      });
  }

  if (type == 'topic') {
    var message: any = {
      notification: {
        title: title,
        body: body,
      },
      data: {},
      android: {
        notification: {
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
      topic: t,
    };
    admin
      .messaging()
      .send(message)
      .then((response: any) => {
        console.log('successfully sent push', response);
      })
      .catch((error: any) => {
        console.log('>>>>>>>>>>>>>>>>>>>>', message);
        console.log(error);
      });
  }
};

const subscribeToTopics = (registrationTokens: String[], topic: String) => {
  // Subscribe the devices corresponding to the registration tokens to the
  // topic.
  console.log(registrationTokens, topic);
  admin
    .messaging()
    .subscribeToTopic(registrationTokens, `/topics/${topic}`)
    .then((response: any) => {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      console.log('Successfully subscribed to topics:', response);
    })
    .catch((error: any) => {
      console.log('Error subscribing to topics:', error);
      console.log('tttttttttt>>>>>>>>>>>>>>>>', registrationTokens, topic);
    });
};

const unsubscribeFromTopics = (registrationTokens: String[], topic: String) => {
  // Subscribe the devices corresponding to the registration tokens to the
  // topic.
  admin
    .messaging()
    .unsubscribeFromTopic(registrationTokens, `/topics/${topic}`)
    .then((response: any) => {
      // See the MessagingTopicManagementResponse reference documentation
      // for the contents of response.
      console.log('Successfully unsubscribed from topics:', response);
    })
    .catch((error: any) => {
      console.log('Error unsubscribing from topics:', error);
    });
};

const jwtExtractor = (req: Request) => {
  const {authorization}: any = req.headers;
  let token = null;
  if (req && req.headers) {
    let tokenParts = authorization.split(' ');
    // tokenParts tokenParts[0] is schema and tokenParts[1] is credentials
    // test matching schema
    if (/^Bearer$/i.test(tokenParts[0])) {
      // use your own schema instead of Bearer
      token = tokenParts[1];
    }
  }
  // Declare token globally to use it out side the function, eg: as `Bearer ${token}` or as token
  // or you can store it to another global variable, eg: jwtString = req.headers.authorization
  return token;
};

const isCircleOwner = async (circle: ICircle, userid: string) => {
  return circle._creator.toString() === userid.toString();
};

const isInvited = async (userid: string, circle: ICircle) => {
  return circle?.invites.some((invitee: any) => invitee == userid.toString());
};

const removeInvitee = async (userid: string, circle: ICircle) => {
  const index = circle.invites.indexOf(userid.toString());
  if (index != -1) {
    circle.invites.splice(index, 1);
    return true;
  }
};

const addMember = async (userid: string, circle: ICircle, user: IUser) => {
  const token = [];
  token.push(user.token);

  removeInvitee(userid, circle);
  const object: any = {};
  object._id = userid;
  object.warnings = 0;
  object.deactivated = false;
  object.trial = 0;
  object.paid = false;
  object.walletId = user.walletId;

  subscribeToTopics(token, circle._id.toString());
  circle.members.push(object);
};

const isMember = async (userid: string, circle: ICircle) => {
  const exists = circle.members.some(
    member => member._id.toString() === userid.toString(),
  );

  const member = circle.members.find(
    member => member._id.toString() == userid.toString(),
  );
  return {exists: exists, member: member};
};

const findCircleById = async (circleid: string) => {
  const circle = await Circle.findOne({_id: circleid});
  return circle;
};

const findUserById = async (userid: string) => {
  const user = await User.findOne({_id: userid});
  return user;
};

const findWalletById = async (walletId: string) => {
  const wallet = await Wallet.findOne({_id: walletId});
  return wallet;
};

const chargeBank = async (data: any, user: IUser) => {
  return axios
    .post('https://api.paystack.co/charge', JSON.stringify(data), {
      headers: {
        Authorization: `Bearer ${endpointsConfig.paystackSecret}`,
        'Content-Type': 'application/json',
      },
    })
    .then(res => {
      return submitBirthday(res.data.data.reference, user);
    })
    .catch(e => {
      console.log(e.response);
    });
};
const submitBirthday = async (ref: string, user: IUser) => {
  var verify_charge = {
    birthday: moment(user?.dob).format('YYYY-MM-DD'),
    reference: ref,
  };

  return axios
    .post(
      'https://api.paystack.co/submit_birthday',
      JSON.stringify(verify_charge),
      {
        headers: {
          Authorization: `Bearer ${endpointsConfig.paystackSecret}`,
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res: any) => {
      return {reference: res?.reference};
    })
    .catch(e => {
      console.log(e.response);
      return {error: true};
    });
};

const createTrfRecipient = async (body: any, data: any) => {
  return axios
    .post('https://api.paystack.co/transferrecipient', data, {
      headers: {
        Authorization: `Bearer ${endpointsConfig.paystackSecret}`,
        'Content-Type': 'application/json',
      },
    })
    .then((res: any) => {
      console.log(res);
      const details = {...body, recipientcode: res.data.data.recipient_code};
      return {status: res.status, details: details};
    })
    .catch((error: any) => {
      console.log(error);
      return error;
    });
};

const updateTrfRecipient = async (body: any, data: any, code: any) => {
  return axios
    .put(`https://api.paystack.co/transferrecipient/${code}`, data, {
      headers: {
        Authorization: `Bearer ${endpointsConfig.paystackSecret}`,
        'Content-Type': 'application/json',
      },
    })
    .then((res: any) => {
      console.log(res);
      const details = {...body, recipientcode: res.data.data.recipient_code};
      return {status: res.status, details: details};
    })
    .catch((error: any) => {
      console.log(error);
      return error;
    });
};
const creditBankAccount = async (
  recipient: string,
  amount: string,
  reason: string,
  reference: string | null,
) => {
  let data;
  if (reference) {
    data = {
      source: 'balance',
      amount: parseInt(amount) * 100,
      recipient,
      reason,
      reference,
    };
  } else {
    data = {
      source: 'balance',
      amount: parseInt(amount) * 100,
      recipient,
      reason,
    };
  }
  return axios
    .post('https://api.paystack.co/transfer', JSON.stringify(data), {
      headers: {
        Authorization: `Bearer ${endpointsConfig.paystackSecret}`,
        'Content-Type': 'application/json',
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(e => {
      return e.response;
    });
};

const debitBankAccount = async (
  authorization_code: string,
  email: string,
  amount: string,
) => {
  const data = {authorization_code, email, amount: parseInt(amount) * 100};
  return axios
    .post(`https://api.paystack.co/transaction/charge_authorization`, data, {
      headers: {
        Authorization: `Bearer ${endpointsConfig.paystackSecret}`,
        'Content-Type': 'application/json',
      },
    })
    .then((res: any) => {
      return res.data;
    })
    .catch((error: any) => {
      return error.response;
    });
};

const verifyDebit = async (
  email: string,
  walletId: string,
  reference: string,
) => {
  const wallet = await Wallet.findById({_id: walletId});
  const result = await axios
    .get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${endpointsConfig.paystackSecret}`,
      },
    })
    .then((res: any) => {
      return {data: res.data, error: null};
    })
    .catch((error: any) => {
      console.log(error.response);
      return {data: null, error: error.response};
    });

  if (wallet && result) {
    //@ts-ignore
    if (result.data.data) {
      if (wallet.bankdetails.authorization != null) {
        return result;
      } else {
        //@ts-ignore

        wallet.bankdetails.authorization = result.data.data.authorization;
        wallet.bankdetails.email = email;
        await wallet.save();
        return result;
      }
    } else {
      return result;
    }
  } else {
    return {data: null, error: 'An error occured, please try again later'};
  }
};

const initiateCredit = async (
  walletId: string,
  amount: any,
  initiatorId: string,
  initiator: string,
  reference: string | null,
) => {
  const wallet = await findWalletById(walletId);
  const circle = await findCircleById(initiatorId);

  if (wallet) {
    // circle is crediting user
    //trf amount into customer account from settlement

    if (circle && wallet?.parent == 'user' && initiator == 'circle') {
      const total = amount;

      console.log('i got to the credit function');

      const transfer = await creditBankAccount(
        wallet.bankdetails.recipientcode,
        `${total}`,
        `Ajo payment from ${circle.circlename} in round ${circle.round.count}`,
        reference ? reference : null,
      );

      console.log(transfer);

      if (
        transfer.data.status == 'pending' ||
        transfer.data.status == 'success'
      ) {
        await saveCredit(
          walletId,
          amount,
          initiatorId,
          initiator,
          transfer.data.reference,
          transfer.data,
        );
        return true;
      } else {
        initiateCredit(
          walletId,
          amount,
          initiatorId,
          initiator,
          transfer.data.reference,
        );
      }
    }

    if (circle && wallet?.parent == 'user' && initiator == 'user') {
      const total = amount;

      console.log('i got to the credit function');

      const transfer = await creditBankAccount(
        wallet.bankdetails.recipientcode,
        `${total}`,
        `Card verification reversal from ajo`,
        reference ? reference : null,
      );

      console.log(transfer);

      if (
        transfer.data.status == 'pending' ||
        transfer.data.status == 'success'
      ) {
        await saveCredit(
          walletId,
          amount,
          initiatorId,
          initiator,
          transfer.data.reference,
          transfer.data,
        );

        return true;
      } else {
        initiateCredit(
          walletId,
          amount,
          initiatorId,
          initiator,
          transfer.data.reference,
        );
      }
    }
  }
};

const initiateDebit = async (
  walletId: string,
  amount: any,
  initiatorId: string,
  initiator: string,
) => {
  // debit customer with paystack here
  const wallet = await findWalletById(walletId);

  if (wallet) {
    const debitResult = await debitBankAccount(
      //@ts-ignore
      wallet?.bankdetails.authorization?.authorization_code,
      wallet.bankdetails.email,
      amount,
    );
    if (debitResult.data.status == 'success') {
      const result = await saveDebit(
        walletId,
        amount,
        initiatorId,
        initiator,
        false,
        debitResult.data.reference,
        debitResult.data,
      );
      return result;
    }
  }
};

const saveCredit = async (
  walletId: string,
  amount: any,
  initiatorId: string,
  initiator: string,
  reference: string,
  creditResult: object,
) => {
  const wallet = await findWalletById(walletId);
  var name;
  if (wallet) {
    const circle = await findCircleById(initiatorId);
    name = circle?.circlename;

    var creditObject = {
      amount,
      initiatorId,
      initiator,
      name,
      createdAt: new Date(),
      reference: reference,
      log: creditResult,
    };
    wallet.transactions.credit.push(creditObject);
    await wallet.save();
    return {wallet: wallet, initiatorExists: true};
  }
};

const saveDebit = async (
  walletId: string,
  amount: any,
  initiatorId: string,
  initiator: string,
  insufficient: boolean,
  reference: string,
  debitResult: object,
) => {
  const wallet = await findWalletById(walletId);
  var name;
  var initiatorExists;
  if (wallet) {
    if (initiator == 'circle') {
      const circle = await findCircleById(initiatorId);
      initiatorExists = true;
      name = circle?.circlename;
    } else {
      const user = await findUserById(initiatorId);
      initiatorExists = true;
      name = `${user?.firstname} ${user?.lastname}`;
    }

    const debitObject = {
      amount,
      initiatorId,
      initiator,
      name,
      createdAt: new Date(),
      reference: reference,
      log: debitResult,
    };
    wallet.transactions.debit.push(debitObject);
    await wallet.save();
    return {wallet: wallet, insufficient, initiatorExists: initiatorExists};
  }
};

const startRoundDeductionsCron = async (circle: ICircle | null) => {
  const list: string[] = [];
  circle?.members.forEach(async (member, idx) => {
    const mem = await findUserById(member._id);
    if (mem) list.push(mem.email);
  });
  circle?.members.forEach(async (member, idx) => {
    var endTask = false;
    const mem = await findUserById(member._id);
    const mailList = list.filter(email => email != mem?.email);
    const wallet = await findWalletById(member.walletId);

    //change from */9 to a formula that allows you attempt a deduction every week

    const task = cron.schedule(`*/9 * * * * *`, async () => {
      //if ajo has ended, don't run any deductions

      if (circle!.round.count - 1 == circle!.capacity) {
        stopTask();
      } else {
        //if a user's deduction tries hasn't reached a maximum of 3 i.e. (deactivated)
        //and the user hasn't paid for the round, try and deduct his wallet.
        console.log(
          'Member trials <=3: ',
          circle!.members[idx].trials <= 3,
          'Member has not paid: ',
          member.paid == false,
        );

        if (circle!.members[idx].trials <= 3 && member.paid == false) {
          if (wallet) {
            //debit each member for ajo
            const isDebitSuccessful = await initiateDebit(
              wallet._id,
              circle!.fee,
              circle!._id,
              'circle',
            );

            if (
              !isDebitSuccessful?.insufficient &&
              isDebitSuccessful?.initiatorExists
            ) {
              //tell each member they were debited here
              const sendToUser = await sendEmail({
                from: 'help@getajo.app',
                to: `${mem?.email}`,
                subject: `Payment Sucessful - ${
                  circle!.circlename
                } charged you ₦${circle!.fee}`,
                templateName: 'payment-successful',
                templateVars: {
                  fee: `${circle!.fee}`,
                  sign: `₦`,
                  round: `${circle!.round.count}`,
                  circleName: `${circle!.circlename}`,
                  recepientName: `${mem?.firstname}`,
                },
              });

              const tkn = [];
              tkn.push(mem?.token);

              sendNotification(
                'user',
                'You just got debited',
                `${circle!.circlename} debited your bank account with ₦${
                  circle!.fee * circle!.capacity
                }`,
                tkn,
              );

              //send email to circle that a member was charged here

              if (sendToUser && mailList.length != 0) {
                await sendEmail({
                  from: 'help@getajo.app',
                  to: mailList,
                  subject: `Someone made a payment in ${
                    circle!.circlename
                  } circle`,
                  templateName: 'someone-paid',
                  templateVars: {
                    fee: `${circle!.fee}`,
                    sign: `₦`,
                    round: `${circle!.round.count}`,
                    circleName: `${circle!.circlename}`,
                    payerName: `${mem?.firstname}`,
                  },
                });
              }

              console.log('debit successful');

              circle!.members[idx].paid = true;
              circle!.members[idx].trials = 0;

              circle = await circle!.save();

              stopTask();
            } else {
              if (circle!.members[idx].trials == 3) {
                //send deactivation mail and deactivate user
                console.log('sending deactivated email');
                member.deactivated = true;
                // circle = await circle!.save();
                const sent = await sendEmail({
                  from: 'help@getajo.app',
                  to: `${mem?.email}`,
                  subject: `${mem?.firstname}, you've been deactivated in [${
                    circle!.circlename
                  }]`,
                  templateName: 'deactivated',
                  templateVars: {
                    sign: `₦`,
                    fee: `${circle!.fee}`,
                    recepientName: `${mem?.firstname}`,
                    circleName: `${circle!.circlename}`,
                  },
                });

                if (sent) {
                  console.log('mail sent');
                } else {
                  console.log('an error occured while sending the mail');
                }
                endTask = true;
                stopTask();
              } else {
                console.log('sending insufficient funds email');
                circle!.members[idx].trials = circle!.members[idx].trials + 1;
                // await circle!.save();
                const sent = await sendEmail({
                  from: 'help@getajo.app',
                  to: `${mem?.email}`,
                  subject: `Insufficient funds [${circle!.circlename}]`,
                  templateName: 'warning',
                  templateVars: {
                    recepientName: `${mem?.firstname}`,
                    sign: `₦`,
                    fee: `${circle!.fee}`,
                    circleName: `${circle!.circlename}`,
                  },
                });

                if (sent) {
                  console.log('mail sent');
                } else {
                  console.log('an error occured while sending the mail');
                }
              }
            }
          }
        }
      }
    });

    // if (circle!.members[idx].paid == true) {
    //   task.stop();
    //   console.log('i destroyed the task');
    // }

    const stopTask = () => {
      console.log('task stopped');
      task.stop();
    };

    ///const tryDeduction = cron.schedule(`0 7 */2 * *`, async () => { original values, don't forget to change back
    // if (stop) {
    //   tryDeduction.stop();
    // }
  });

  await circle!.save();
};

const startRound = async (circle: ICircle) => {
  if (circle) {
    await startRoundDeductionsCron(circle);
    await startNextRoundCron(circle);
  }
};

const startNextRoundCron = async (circle: ICircle | null) => {
  const now = moment(new Date());
  const timeIncrement = moment(now).add(60, 'seconds').format();
  // const timeIncrement = moment(now)
  //   .add(circle.round.duration, 'secqonds')
  //   .format();
  console.log(timeIncrement);
  const date = new Date(timeIncrement);
  const nextRoundToCron = dateToCron(date);

  const list: string[] = [];
  var multipleMembersTkn: any = [];
  circle!.members.forEach(async member => {
    const mem = await findUserById(member._id);
    if (mem) {
      list.push(mem.email);
      multipleMembersTkn.push(mem.token);
    }
  });

  if (circle!.round.count - 1 == circle!.capacity) {
    console.log('ajo ended');
    circle!.paused = true;
    circle!.started = true;
    await circle!.save();

    await sendEmail({
      from: 'help@getajo.app',
      to: list,
      subject: `Ajo Ended - ${circle!.circlename} circle`,
      templateName: 'ajo-ended',
      templateVars: {
        round: `${circle!.round.count}`,
        circleName: `${circle!.circlename}`,
      },
    });

    //send push to all users when ajo ends
  } else {
    cron.schedule(nextRoundToCron, async () => {
      circle = await findCircleById(circle!._id);
      const allDuesPaid = circle!.members.every(member => member.paid == true);

      if (allDuesPaid) {
        console.log('all dues paid for this round, we move');
        var nextMemberId = circle!.round.funding[0];

        const index = circle!.round.funding.findIndex(
          memberId => memberId.toString() == nextMemberId.toString(),
        );

        if (index != -1) {
          const mem = await findUserById(nextMemberId.toString());
          const mailList = list.filter(email => email != mem?.email);
          multipleMembersTkn = multipleMembersTkn.filter(
            (token: any) => token != mem?.token,
          );
          const member = await findUserById(nextMemberId.toString());

          if (member) {
            const credited = await initiateCredit(
              member.walletId,
              circle!.fee * circle!.capacity,
              circle!._id,
              'circle',
              null,
            );

            const fundingAmount = circle!.fee * circle!.capacity;

            console.log(
              'crediting member with ',
              circle!.fee * circle!.capacity,
            );
            circle!.round.funded.push(nextMemberId);
            circle!.round.funding.splice(index, 1);
            circle!.members.forEach((member, idx) => {
              circle!.members[idx].paid = false;
              circle!.members[idx].warnings = 0;
            });
            circle!.round.lastRoundEndDate = new Date();

            const sentToUser = await sendEmail({
              from: 'help@getajo.app',
              to: `${member.email}`,
              subject: `You will soon be credited with ₦${fundingAmount} - ${
                circle!.circlename
              }`,
              templateName: 'funding-successful',
              templateVars: {
                fundingAmount: `${fundingAmount}`,
                sign: `₦`,
                round: `${circle!.round.count}`,
                circleName: `${circle!.circlename}`,
                recepientName: `${member.firstname}`,
                capacity: `${circle!.capacity}`,
              },
            });

            if (sentToUser && mailList.length != 0) {
              const sent = await sendEmail({
                from: 'help@getajo.app',
                to: mailList,
                subject: `${member.firstname} will be funded now - ${
                  circle!.circlename
                }`,
                templateName: 'someone-funded',
                templateVars: {
                  fundingAmount: `${fundingAmount}`,
                  sign: `₦`,
                  round: `${circle!.round.count}`,
                  circleName: `${circle!.circlename}`,
                  fundedName: `${member.firstname}`,
                  capacity: `${circle!.capacity}`,
                },
              });
            }

            //send a push notification to who was funded and everyone in the circle

            if (credited && circle) {
              const singleMemberTkn = [];
              singleMemberTkn.push(mem?.token);

              mem?.notifications.push({
                title: 'You just got funded',
                content: `${
                  circle.circlename
                } credited your bank account with ₦${
                  circle!.fee * circle!.capacity
                }`,
                createdAt: new Date(),
              });
              await mem?.save();

              sendNotification(
                'user',
                'You just got funded',
                `${circle.circlename} credited your bank account with ₦${
                  circle!.fee * circle!.capacity
                }`,
                singleMemberTkn,
              );

              sendNotification(
                'user',
                'Someone just got funded',
                `${circle.circlename} credited ${member.firstname} with ₦${
                  circle!.fee * circle!.capacity
                }`,
                multipleMembersTkn,
              );
            }

            circle!.round.count = circle!.round.count + 1;
            circle!.markModified('round');
            circle!.markModified('members');
            circle = await circle!.save();
            console.log('i funded, and called a recursive function');
            await startRoundDeductionsCron(circle);
            await startNextRoundCron(circle);
          }
        }
      } else {
        console.log('people did not pay dues for this round, we move');
        //do something when round time's up but not everyone has paid
      }
    });
  }
};

const dateToCron = (date: any) => {
  const minutes = date.getMinutes();
  const hours = date.getHours();
  const days = date.getDate();
  const months = date.getMonth() + 1;
  const dayOfWeek = date.getDay();

  return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
};

export {
  jwtExtractor,
  isCircleOwner,
  isInvited,
  findCircleById,
  removeInvitee,
  subscribeToTopics,
  unsubscribeFromTopics,
  addMember,
  isMember,
  findUserById,
  initiateCredit,
  initiateDebit,
  startRoundDeductionsCron,
  startRound,
  chargeBank,
  verifyDebit,
  createTrfRecipient,
  updateTrfRecipient,
  sendNotification,
};
