import Pagination from "@/app/components/customizable/Pagination";
import { redirect } from "next/navigation";
import { fetchUserOrders } from "@/utils/strapi/get";
import { cookies } from "next/headers";
import OrdersList from "./components/OrdersList";
import AnimateWrapper from "@/app/components/layout/root/AnimateWrapper";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | undefined;
  };
}) {
  const jwt = cookies().get(
    process.env.JWT_AUTH_TOKEN_COOKIE_NAME as string
  )?.value;

  let orders: Partial<Order>[] = [];
  let ordersMeta: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  } = {
    page: 0,
    pageSize: 0,
    pageCount: 0,
    total: 0,
  };

  let page: any;

  try {
    page = searchParams?.page && +searchParams.page;

    if (!Number.isInteger(page)) {
      page = 1;
    }

    const response = await fetchUserOrders(page, jwt);

    if (response?.data) {
      orders = response.data.orders;
      ordersMeta = response.data.ordersMeta;
    }

    if (response?.error) {
      throw new Error(response?.error);
    }
  } catch (error: any) {
    if (error?.message === "401") {
      redirect("/auth/login?from=/dashboard/orders&signed-out=true");
    } else
      throw new Error(
        error?.message || "Something went wrong, please try again later"
      );
  }

  return (
    <AnimateWrapper>
      <main className="max-w-[1200px] w-full mx-0 flex flex-col">
        <h2 className="font-semibold text-xl text-black mb-10">
          Orders history
        </h2>
        <section
          className="w-full flex flex-col md:h-[500px] scroll-m-44"
          id="orders_list"
        >
          <OrdersList orders={orders} />
        </section>
        <Pagination
          total={ordersMeta?.total}
          page={ordersMeta?.page}
          pageCount={ordersMeta?.pageCount}
          scrollTo={"orders_list"}
        />
      </main>
    </AnimateWrapper>
  );
}
