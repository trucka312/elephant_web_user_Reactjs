import { auth } from "./auth";
import { badges } from "./badges";
import { identityRequest } from "./identityRequest";
import { products } from "./products";
import { address } from "./address";
import { categories } from "./categories";
import { orders } from "./orders";
import { storeDataInfo } from './infoStore';
import { branches } from './branches';
import { chat } from './chat';
import { vouchers } from "./vouchers";
import { discounts } from "./discounts.js"
import { report } from "./report.js"
import { finance } from "./finance.js";

export const RepositoryRemote = {
  auth,
  discounts,
  identityRequest,
  products,
  badges,
  address,
  categories,
  orders,
  storeDataInfo,
  branches,
  chat,
  vouchers,
  report,
  finance,
};