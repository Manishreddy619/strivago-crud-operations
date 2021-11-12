import express from "express";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../auth/tokenmiddleware";
import accomadationSchema from "./schema";

const accomRouter = express.Router();

accomRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    if (req.user) {
      if (req.user?.role === "Guest") {
        res.send(createHttpError(403, "you are forbidden for this activity"));
      } else {
        const { name, description, city, totalGuest } = req.body;
        const acc = {
          name,
          description,
          city,
          totalGuest,
          userId: req.user._id,
        };
        const newAccomadation = new accomadationSchema(acc);
        const accomadation = await newAccomadation.save();
        res.send(accomadation);
      }
    } else {
      res.send(createHttpError(500, "server error"));
    }
  } catch (error) {
    next(error);
  }
});
accomRouter.get(
  "/",
  JWTAuthMiddleware,
  // JWTAuthMiddleware,
  // adminOnlyMiddleware,
  async (req, res, next) => {
    try {
      if (req.user) {
        const accomadations = await accomadationSchema.find();

        res.send(accomadations);
      } else {
        res.send("you must be logged in to access our source");
      }
    } catch (error) {
      next(error);
    }
  }
);
accomRouter.get("/:accId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accId = req.params.accId;

    if (req.user) {
      const accomadation = await accomadationSchema.findById(accId);
      // similar to findOne, but findOne expects to receive a query as parameter
      if (accomadation) {
        res.send(accomadation);
      } else {
        console.log(accId);
        next(createHttpError(404, `accomadation with id ${accId} not found!`));
      }
    } else {
      res.send("you must be logged in to access our source");
    }
  } catch (error) {
    next(error);
  }
});
accomRouter.put("/:accId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    if (req.user) {
      if (req.user.role === "Host") {
        const accId = req.params.accId;
        const modifiedAccomadation = await accomadationSchema.findByIdAndUpdate(
          accId,
          req.body,
          {
            new: true, // returns the modified blog
          }
        );

        if (modifiedAccomadation) {
          res.send(modifiedAccomadation);
        } else {
          next(createHttpError(404, `blog with id ${accId} not found!`));
        }
      } else {
        res.send(createHttpError(403, "you are forbidden for this activity"));
      }
    } else {
      res.send(createHttpError(500, "server error"));
    }
  } catch (error) {
    next(error);
  }
});

accomRouter.delete("/:accId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    if (req.user) {
      if (req.user.role === "Host") {
        const accId = req.params.accId;

        const deletedAccomdation = await accomadationSchema.findByIdAndDelete(
          accId
        );

        if (deletedAccomdation) {
          res.status(204).send();
        } else {
          next(createHttpError(404, `blog with id ${accId} not found!`));
        }
      } else {
        res.send(createHttpError(403, "you are forbidden for this activity"));
      }
    } else {
      res.send(createHttpError(500, "server error"));
    }
  } catch (error) {
    next(error);
  }
});
export default accomRouter;
