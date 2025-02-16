import { Schema, model } from "mongoose";
import { IActivnessName, IStatus } from "../utils/common";

export interface IGame {
  questionId: string;
  answerId: string;
  groupId: string;
  answer: string;
  question: string;
  askedBy: string;
  answeredBy: string;
  dateTime: string;
  status: IStatus;
  isActive: IActivnessName;
}

/**
 * Represents a game schema.
 *
 * @property {Schema.Types.ObjectId} questionId - The ID of the question, referencing the "Question" model.
 * @property {string} answerId - The ID of the answer.
 * @property {string} groupId - The ID of the group.
 * @property {string} answer - The answer text.
 * @property {string} question - The question text.
 * @property {string} askedBy - The user who asked the question.
 * @property {string} answeredBy - The user who answered the question.
 * @property {string} dateTime - The date and time when the question was asked.
 * @property {string} status - The status of the game.
 * @property {string} isActive - Indicates whether the game is active.
 *
 * @typedef {Object} Game
 */
const game = new Schema(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "questions",
      require: true,
    },
    answerId: { type: String, require: true },
    groupId: { type: String, require: true },
    answer: { type: String, require: true },
    question: { type: String, require: true },
    askedBy: { type: String, require: true },
    answeredBy: { type: String, require: true },
    dateTime: { type: String, require: true },
    status: { type: String, require: true },
    isActive: { type: String, require: true },
  },
  { timestamps: true }
);

const GameModel = model("game", game);
export default GameModel;
