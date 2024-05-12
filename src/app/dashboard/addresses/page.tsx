import { fetchUsersAddresses } from "@/utils/strapi/get";
import { cookies } from "next/headers";
import AddNewAddressButtonForm from "./components/AddNewAddressButtonForm";
import AddressDataDisplayController from "./components/AddressDataDisplayController";
import { redirect } from "next/navigation";
import AnimateWrapper from "@/app/components/layout/root/AnimateWrapper";

export default async function AddressesPage() {
  const jwt = cookies().get(
    process.env.JWT_AUTH_TOKEN_COOKIE_NAME as string
  )?.value;

  let addresses: IShippingAddress[];

  try {
    const response = await fetchUsersAddresses(jwt);
    if (response?.data) {
      addresses = response.data;
    } else throw new Error(response?.error);
  } catch (error: any) {
    if (error.message === "401") {
      redirect(`/auth/login?from=/dashboard/addresses&signed-out=true`);
    } else
      throw new Error(
        error?.message || "Something went wrong, please try again later"
      );
  }

  return (
    <AnimateWrapper>
      <main className="max-w-[1200px] w-full flex-grow flex flex-col mx-0">
        <h2 className="font-semibold text-xl text-black mb-10">
          Shipping Addresses
        </h2>
        <section className="w-full flex flex-wrap gap-10">
          {addresses
            .sort((a, b) =>
              a.main ? -1 : a?.id && b?.id ? (a.id < b.id ? -1 : 1) : 1
            )
            .map((address, idx) => (
              <AddressDataDisplayController
                key={address?.id || idx}
                address={address}
                addressesCount={addresses.length}
                cardTitle={
                  idx === 0
                    ? "Main address"
                    : idx === 1
                    ? "Secondary address"
                    : "Tertiary address"
                }
              />
            ))}
          {addresses?.length < 3 && (
            <AddNewAddressButtonForm addressesCount={addresses.length} />
          )}
        </section>
      </main>
    </AnimateWrapper>
  );
}
