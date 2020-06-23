import { Response, Request } from "http://deno.land/x/oak/mod.ts";
import { Product } from "../types.ts";

let products: Product[] = [{
  id: "1",
  name: "Product 1",
  price: 23,
}, {
  id: "2",
  name: "Product 2",
  price: 17,
}, {
  id: "3",
  name: "Product 3",
  price: 13.99,
}];

const getProducts = ({ response }: { response: Response }) => {
  response.body = {
    success: true,
    data: products,
  };
};

const getProduct = (
  { response, params }: { response: Response; params: { id: string } },
) => {
  const product = products.find((product) => product.id === params.id);

  if (product) {
    response.status = 200;
    response.body = {
      success: true,
      data: product,
    };
    return;
  }

  response.status = 404;
  response.body = {
    success: false,
    msg: "Not found",
  };
};

const addProduct = async (
  { request, response }: {
    request: Request;
    response: Response;
  },
) => {
  const body = await request.body();

  if (!body.value) {
    response.status = 404;
    response.body = {
      success: false,
      msg: "No data",
    };
  }

  products.push(body.value);

  response.body = {
    success: true,
    data: products,
  };
};

const deleteProduct = (
  { response, params }: { response: Response; params: { id: string } },
) => {
  const product = products.find((product) => product.id === params.id);

  if (product) {
    products = products.filter((product) => product.id !== params.id);
    response.status = 200;
    response.body = {
      success: true,
      data: products,
    };

    return;
  }

  response.status = 404;
  response.body = {
    success: false,
    msg: "Not found",
  };
};

const updateProduct = async (
  { request, response, params }: {
    request: Request;
    response: Response;
    params: { id: string };
  },
) => {
  const productToUpdate = products.find((product) => product.id === params.id);

  const body = await request.body();

  console.log(body);

  if (!body.value) {
    response.status = 404;
    response.body = {
      success: false,
      msg: "No data to update",
    };

    return;
  }

  if (productToUpdate) {
    products = products.map((product) => {
      if (product.id === productToUpdate.id) {
        return body.value;
      }
      return product;
    });
    response.status = 200;
    response.body = {
      success: true,
      data: products,
    };
    return;
  }

  response.status = 404;
  response.body = {
    success: false,
    msg: "Not found",
  };
};

export { getProducts, getProduct, addProduct, deleteProduct, updateProduct };
