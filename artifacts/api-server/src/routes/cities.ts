import { Router, type IRouter } from "express";
import { CITIES, getCityById } from "../data/cities";
import {
  GetCitiesResponse,
  GetCityParams,
  GetCityResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/cities", async (_req, res): Promise<void> => {
  res.json(GetCitiesResponse.parse(CITIES));
});

router.get("/cities/:cityId", async (req, res): Promise<void> => {
  const params = GetCityParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const city = getCityById(params.data.cityId);
  if (!city) {
    res.status(404).json({ error: "City not found" });
    return;
  }

  res.json(GetCityResponse.parse(city));
});

export default router;
