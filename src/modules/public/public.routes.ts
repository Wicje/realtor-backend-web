
import { Router } from "express";
import { publicRealtorPage } from "./public.controller";

const router = Router();

router.get("/r/:slug", publicRealtorPage);
router.get("/r/:slug/property/:id", publicProperty);

export default router;
