import {
  createServer,
  Factory,
  Model,
  Response,
  ActiveModelSerializer,
} from "miragejs";
import faker from "faker";

type User = {
  name: string;
  email: string;
  created_at: string;
};
type Product = {
  description: string;
  stock: number;
  price: string;
  created_at: string;
};
type Client = {
  name: string;
  address: number;
  country: string;
  phone: string;
  gender: string;
  created_at: string;
};

export function makeServer() {
  const server = createServer({
    serializers: {
      application: ActiveModelSerializer,
    },
    models: {
      user: Model.extend<Partial<User>>({}),
      product: Model.extend<Partial<Product>>({}),
      client: Model.extend<Partial<Client>>({}),
    },

    factories: {
      user: Factory.extend({
        name() {
          // return `User ${i + 1}`;
          return faker.name.firstName();
        },
        email() {
          return faker.internet.email().toLocaleLowerCase();
        },
        createdAt() {
          return faker.date.recent(10);
        },
      }),
      product: Factory.extend({
        description() {
          return faker.commerce.productName();
        },
        stock() {
          return faker.datatype.number();
        },
        price() {
          return faker.commerce.price();
        },
        createdAt() {
          return faker.date.recent(10);
        },
      }),
      client: Factory.extend({
        name() {
          return faker.name.firstName();
        },
        address() {
          return faker.address.streetAddress(true);
        },
        phone() {
          return faker.phone.phoneNumber();
        },
        gender() {
          return faker.name.gender();
        },
        createdAt() {
          return faker.date.recent(10);
        },
      }),
    },

    seeds(server) {
      server.createList("user", 10);
      server.createList("product", 20);
      server.createList("client", 200);
    },

    routes() {
      this.namespace = "api";
      this.timing = 750;

      this.get("/users", function (schema, request) {
        const { page = 1, per_page = 10 } = request.queryParams;

        const total = schema.all("user").length;

        const pageStart = (Number(page) - 1) * Number(per_page);
        const pageEnd = pageStart + Number(per_page);

        const users = this.serialize(schema.all("user")).users.slice(
          pageStart,
          pageEnd
        );

        return new Response(200, { "x-total-count": String(total) }, { users });
      });

      this.get("/products", function (schema, request) {
        const { page = 1, per_page = 10 } = request.queryParams;

        const total = schema.all("product").length;

        const pageStart = (Number(page) - 1) * Number(per_page);
        const pageEnd = pageStart + Number(per_page);

        const products = this.serialize(schema.all("product")).products.slice(
          pageStart,
          pageEnd
        );

        return new Response(
          200,
          { "x-total-count": String(total) },
          { products }
        );
      });
      this.get("/clients", function (schema, request) {
        const { page = 1, per_page = 10 } = request.queryParams;

        const total = schema.all("client").length;

        const pageStart = (Number(page) - 1) * Number(per_page);
        const pageEnd = pageStart + Number(per_page);

        const clients = this.serialize(schema.all("client")).clients.slice(
          pageStart,
          pageEnd
        );

        return new Response(
          200,
          { "x-total-count": String(total) },
          { clients }
        );
      });

      this.get("/products/:id");
      this.post("/products");
      this.get("/users/:id");
      this.post("/users");
      this.get("/clients/:id");
      this.post("/clients");

      this.namespace = "";
      this.passthrough();
    },
  });

  return server;
}
