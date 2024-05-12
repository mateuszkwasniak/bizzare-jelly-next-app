"use client";

import Modal from "@/app/components/customizable/Modal";
import { useAuthState } from "@/hooks/store/auth";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import AddOrEditAddressForm from "./AddOrEditAddressForm";
import AddressCard from "./AddressCard";
import { AnimatePresence } from "framer-motion";
import { detachShippingAddress } from "@/utils/strapi/put";

export default function AddressDataDisplayController({
  address,
  addressesCount,
  cardTitle,
}: {
  address: IShippingAddress;
  addressesCount: number;
  cardTitle: string;
}) {
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const jwt = useAuthState((state) => state.auth.jwt);

  const router = useRouter();

  const removeShippingAddress = async () => {
    setLoading(true);
    if (address?.id) {
      try {
        const response = await detachShippingAddress(address?.id, jwt);
        if (response?.error) {
          throw new Error(response?.error);
        }
        setShowModal(false);
        router.refresh();
      } catch (error: any) {
        if (error?.message === "401") {
          router.replace(
            "/auth/login?from=/dashboard/addresses&signed-out=true"
          );
        }
        setModalError(
          error?.message ||
            "Unable to remove the shipping address, please try again later."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {!openForm && (
        <AddressCard
          key={"card"}
          address={address}
          addressesCount={addressesCount}
          cardTitle={cardTitle}
          setOpenForm={setOpenForm}
          setShowModal={setShowModal}
        />
      )}
      {openForm && (
        <AddOrEditAddressForm
          key={"form"}
          addressesCount={addressesCount}
          addressDetails={address}
          setOpenForm={setOpenForm}
          edit={true}
        />
      )}
      {showModal && (
        <Modal
          key={"modal"}
          text="Do you REALLY want to delete this address?"
          btnLeftText="Cancel"
          btnRightText="DELETE"
          onBtnLeftClick={() => setShowModal(false)}
          onBtnRightClick={() => removeShippingAddress()}
          onErrorBtnClick={() => {
            setModalError("");
            setShowModal(false);
          }}
          modalError={modalError}
          btnRightClassname="bg-red-600 hover:!bg-red-500"
          loading={loading}
        />
      )}
    </AnimatePresence>
  );
}
