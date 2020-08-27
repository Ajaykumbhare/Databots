const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = require("../../config/key");
const passport = require("passport");
// const generator = require("generate-password");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const async = require("async");
const R = require("ramda");

/**
 * *Load workRequest Model
 */
const WorkRequest = require("../../models/WorkRequest");
const User = require("../../models/User");

/**
 * @desc Validation Module
 */
const validateWorkRequestInput = require("../../validation/work-request");
const validateChatInput = require("../../validation/validateChatInput");

/**
 * @route  GET api/request
 * @desc   GET Requests
 * @access Private
 */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    WorkRequest.find(req.user.roleId === 1 ? {} : { user: req.user.id })
      .sort({ updated_on: -1 })
      .then(workRequest => res.json(workRequest))
      .catch(err =>
        res.status(404).json({ norequestsfound: "No Requests found" })
      );
  }
);

/**
 * @route  GET api/workRequest/request/:id
 * @desc   GET Requests by ID
 * @access Private
 */
router.get(
  "/request/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.id) {
      WorkRequest.findById(req.params.id)
        .populate("user", ["name"])
        .populate({ path: "chats.user", select: ["_id", "name"] })
        .then(workRequest => {
          if (
            workRequest.user._id.toString() === req.user.id ||
            req.user.roleId === 1
          ) {
            res.json(workRequest);
          } else {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }
        })
        .catch(err => {
          res.status(404).json({ norequestsfound: "No Requests found" });
          console.log(err);
        });
    } else {
      WorkRequest.findById(req.param.id).then(workRequest => {
        if (
          workRequest.user.toString() !== req.user.id ||
          req.user.roleId === 1
        ) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }
        res.status(200).json(workRequest);
      });
    }
  }
);

/**
 * @route  GET api/workRequest/offer
 * @desc   GET All offers
 * @access Private
 */

router.get(
  "/offer",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let query = {
      offerSent: true
    };
    if (req.user.roleId === 0) {
      query.user = req.user.id;
    }
    WorkRequest.find(query, {
      _id: 1,
      title: 1,
      offerAmount: 1,
      deliveryTime: 1,
      updated_on: 1,
      status: 1,
      offerSentBy: 1
    })
      .populate("offerSentBy", ["name"])
      .sort({ updated_on: -1 })
      .then(workRequest => {
        res.status(200).json(workRequest);
      })
      .catch(err =>
        res.status(404).json({ norequestsfound: "No Requests found" })
      );
  }
);

/**
 * @route  GET api/workRequest/offer/:id
 * @desc   GET offers by ID
 * @access Private
 */

router.get(
  "/offer/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let query = {
      _id: req.params.id,
      offerSent: true
    };
    if (req.user.roleId === 0) {
      query.user = req.user.id;
    }
    WorkRequest.find(query, {
      user: 1,
      _id: 1,
      title: 1,
      offerAmount: 1,
      deliveryTime: 1,
      updated_on: 1,
      status: 1,
      offerSentBy: 1,
      description: 1,
      delivery_on: 1
    })
      .populate("offerSentBy", ["name"])
      .populate("user", ["name"])
      .sort({ updated_on: -1 })
      .then(workRequest => {
        res.status(200).json(workRequest);
      })
      .catch(err =>
        res.status(404).json({ norequestsfound: "No Requests found" })
      );
  }
);

/**
 * @route Post Request from api/workRequest/register
 * @desc Register user route
 * @access Public
 */

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateWorkRequestInput(req.body);
    //Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newRequest = new WorkRequest({
      user: req.user.id,
      title: req.body.title,
      description: req.body.description,
      status: 0,
      created_on: Date.now(),
      updated_on: Date.now()
    });

    newRequest.save().then(request => res.json(request));
  }
);

/**
 *   @route POST Request Reply from api/workRequest/chat/:id
 *   @desc Post reply to Request
 *   @access Private
 */

router.post(
  "/chat/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateChatInput(req.body);
    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    WorkRequest.findById(req.params.id)
      .then(workRequest => {
        let docs = {};
        if (req.body.fileName !== "") {
          docs.fileName = req.body.fileName;
          docs.fileObject = req.body.fileObject;
        }
        const newChat = {
          text: req.body.text,
          name: req.user.name,
          user: req.user.id,
          roleId: req.user.roleId,
          docs: docs
        };

        // Add to chats array
        workRequest.chats.push(newChat);
        workRequest.updated_on = Date.now();
        // Save
        // workRequest.save().then(workRequest => res.json(workRequest));
        workRequest
          .save()
          .then(() => {
            WorkRequest.findById(req.params.id)
              .populate("user", ["name"])
              .populate({ path: "chats.user", select: ["_id", "name"] })
              .then(workRequest => {
                if (
                  workRequest.user._id.toString() === req.user.id ||
                  req.user.roleId === 1
                ) {
                  res.json(workRequest);
                } else {
                  return res
                    .status(401)
                    .json({ notauthorized: "User not authorized" });
                }
              })
              .catch(err => {
                res.status(404).json({ norequestsfound: "No Requests found" });
                console.log(err);
              });
          })
          .catch(e => console.log(e));
      })
      .catch(err =>
        res.status(404).json({ workRequestnotfound: "No workRequest found" })
      );
  }
);

/**
 *   @route  Sent OFFER from api/workRequest/offer/:id
 *   @desc   SENT OFFER
 *   @access Private
 */

router.post(
  "/offer/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    WorkRequest.findById(req.params.id)
      .then(workResult => {
        workResult.offerSent = true;
        workResult.offerSentBy = req.user.id;
        workResult.offerAmount = req.body.offerAmount;
        workResult.deliveryTime = req.body.deliveryTime;
        workResult.updated_on = Date.now();
        workResult.save();
        res.status(200).json(workResult);
      })
      .catch(e => res.status(401).json({ error: "No Request Found" }));
  }
);

/**
 *   @route  DELETE Chats from api/workRequest/chat/:id/:chat_id
 *   @desc   Remove Chat Message
 *   @access Private
 */

router.delete(
  "/chat/:id/:chat_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    WorkRequest.findById(req.params.id)
      .then(chat => {
        // Check to see if chat exists
        if (
          chat.chats.filter(chat => chat._id.toString() === req.params.chat_id)
            .length === 0
        ) {
          return res.status(404).json({ chatnotexists: "Chat does not exist" });
        }

        // Get remove index
        const removeIndex = chat.chats
          .map(item => item._id.toString())
          .indexOf(req.params.chat_id);

        // Splice comment out of array
        chat.chats.splice(removeIndex, 1);

        chat.save().then(chat => res.json(chat));
      })
      .catch(err => res.status(404).json({ chatnotfound: "No chat found" }));
  }
);

/**
 *   @route DELETE Request from api/workRequest/:id
 *   @desc Delete Request
 *   @access Private
 */

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    User.findOne({ user: req.user.id }).then(profile => {
      WorkRequest.findById(req.params.id)
        .then(workRequest => {
          // Check for Request Owner
          if (workRequest.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          // Delete
          workRequest.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res.status(404).json({ requestnotfound: "No request found" })
        );
    });
  }
);

/**
 *   @route POST Request from api/workRequest/markAsComplete/:id
 *   @desc POST Request
 *   @access Private
 */

router.post(
  `/markAsComplete/:id`,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    WorkRequest.findById(req.params.id).then(work => {
      if (work.user.toString() === req.user.id) {
        work.status = 2;
        work.delivery_on = Date.now();
        work.updated_on = Date.now();
        work
          .save()
          .then(() => res.status(200).json({ work: work.delivery_on }))
          .catch(err => res.status(400).json({ error: err }));
      } else {
        return res.status(400).json({ error: "unauthorize access" });
      }
    });
  }
);

router.get(
  "/getDashboardCount",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let query = {};
    if (req.user.roleId === 0) {
      query.user = req.user.id;
    }
    WorkRequest.find(query, { _id: 1, status: 1 }).then(work => {
      let past = 0;
      let active = 0;
      let total = 0;
      work.filter(x => {
        x.status === 2
          ? (past += 1)
          : x.status === 1
          ? (active += 1)
          : (total += 1);
      });
      return res.json({
        past: past,
        active: active,
        total: total + (past + active)
      });
    });
  }
);

module.exports = router;
