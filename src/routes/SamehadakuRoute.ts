import { Hono } from "hono";
import { SameHadakuController } from "../controllers/SamehadakuController";
import { upgradeWebSocket, websocket } from 'hono/bun'

const samehadakuController = new SameHadakuController()
export const SamehadakuRoute = new Hono()
