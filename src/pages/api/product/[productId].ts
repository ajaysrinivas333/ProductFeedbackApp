// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { PRODUCT_CATEGORIES } from '../../../backend/constants';
import connectDb from '../../../backend/db/connection';
import { isEmpty, isAuthenticated, hasKey } from '../../../backend/helpers';
import Product from '../../../backend/models/product';

type ProductResponse = {
  ok: boolean;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProductResponse>
) {
  switch (req.method) {
    case 'PATCH': {
      try {
        if (hasKey(req?.body, 'name') && isEmpty(req?.body?.name))
          throw new Error(`Product name cannot be empty`);

        if (hasKey(req?.body, 'description') && isEmpty(req?.body?.description))
          throw new Error(`Product description cannot be empty`);

        if (
          hasKey(req?.body, 'category') &&
          !Object.values(PRODUCT_CATEGORIES).includes(req.body?.category)
        )
          throw new Error(`Invalid category`);

        const userId = await isAuthenticated(req);

        if (!userId) throw new Error(`Authentication failed`);

        await connectDb();

        await Product.findByIdAndUpdate(req.query.productId, {
          ...req.body,
        });

        res
          .status(200)
          .json({ ok: true, message: 'Product Updated successfully' });
      } catch (err: any) {
        res.status(400).json({ ok: false, message: err.message });
      }
      break;
    }
  }
}
