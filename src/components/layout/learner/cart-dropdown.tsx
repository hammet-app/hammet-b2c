"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { cartApi } from "@/lib/api/cart";
import { getCartItemsFromDB } from "@/lib/db";
import { useAuth } from "@/lib/auth/auth-context";
import { BackendProductTypeDto, CartItemResponse } from "@/lib/api/types";
import { useRouter } from "next/navigation";

function CartDropdownSkeleton() {
  return (
    <div className="p-4 animate-pulse">
      {/* Skeleton cart items */}
      {[1, 2].map((item) => (
        <div
          key={item}
          className="mb-4 flex items-start justify-between gap-3 border-b border-black/[0.04] pb-4 last:border-0 dark:border-white/[0.04]"
        >
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded-md bg-slate-200 dark:bg-white/10" />
            <div className="h-3 w-1/3 rounded-md bg-slate-100 dark:bg-white/[0.06]" />
          </div>

          <div className="h-4 w-4 rounded-full bg-slate-200 dark:bg-white/10" />
        </div>
      ))}

      {/* Checkout button skeleton */}
      <div className="mt-4 h-10 w-full rounded-xl bg-slate-200 dark:bg-white/10" />
    </div>
  );
}

export function CartDropdown() {
  const router = useRouter();
  const { accessToken, refreshToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  //const getTotal = useCart((state) => state.getTotal);
  //const couponCode = useCart((state) => state.couponCode);
  //const discountPercentage = useCart((state) => state.discountPercentage);
  //const getDiscountAmount = useCart((state) => state.getDiscountAmount);
  //const getFinalTotal = useCart((state) => state.getFinalTotal);

  const refreshCart = useCallback(async () => {
    if (!accessToken) {
      setCartItems([]);
      return;
    }

    try {
      const cart = await cartApi.getCart(accessToken, refreshToken);
      if (cart && cart.carts) {
        setCartItems(cart.carts);
      }
    } catch (err) {
      console.warn("CartDropdown: refreshCart failed:", err);
    }
  }, [accessToken, refreshToken]);

  const fetchCart = useCallback(async () => {
    if (!accessToken) {
      setCartItems([]);
      setCartLoading(false);
      return;
    }

    try {
      setCartLoading(true);
      const cart = await cartApi.getCart(accessToken, refreshToken);
      setCartItems(cart?.carts ?? []);
    } catch (err) {
      console.warn("CartDropdown: fetchCart failed:", err);
    } finally {
      setCartLoading(false);
    }
  }, [accessToken, refreshToken]);

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const handleCartUpdated = () => {
      // Trigger a fresh fetch when another component updates the cart.
      fetchCart();
    };

    window.addEventListener("cart-updated", handleCartUpdated);

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, [fetchCart]);

  const handleCheckout = async () => {
    if (!accessToken || checkoutLoading) return;

    try {
      setCheckoutLoading(true);

      // Best effort pre-sync: ensure any pending local cart items exist on the remote backend
      try {
        const localItems = await getCartItemsFromDB();
        for (const item of localItems) {
          await cartApi.addItem(item, accessToken);
        }
      } catch (syncErr) {
        console.warn("Pre-checkout cart sync warning:", syncErr);
      }

      const orderResponse = await cartApi.checkout(accessToken, refreshToken);
      sessionStorage.setItem("checkoutOrder", JSON.stringify(orderResponse));

      setOpen(false);
      router.push("/learner/checkout");
    } catch (error) {
      console.warn("Backend checkout initialization warning:", error);
    } finally {
      setCheckoutLoading(false);
      setOpen(false);
      router.push("/learner/checkout");
    }
  };

  return (
    <div
      className="relative z-50"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href="/learner/checkout"
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-white"
        aria-label="View Cart"
      >
        <ShoppingCart className="h-5 w-5" />
        {cartItems.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px] font-bold text-white shadow-sm">
            {cartItems.length}
          </span>
        )}
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-xl dark:border-white/[0.06] dark:bg-[#18181B]"
          >
            <div className="p-4 text-slate-900 dark:text-white">
              {cartLoading ? (
                <CartDropdownSkeleton />
              ) : cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <ShoppingCart className="mb-3 h-8 w-8 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-medium">Your cart is empty.</p>
                  <Link
                    href="/learner/ai-schools"
                    className="mt-2 text-xs text-purple-600 hover:underline dark:text-cyan-400"
                  >
                    Keep shopping
                  </Link>
                </div>
              ) : (
                <>
                  <div className="max-h-60 overflow-y-auto pr-2">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="mb-4 flex items-start justify-between gap-3 border-b border-black/[0.04] pb-4 last:mb-0 last:border-0 last:pb-0 dark:border-white/[0.04]"
                      >
                        <div className="flex-1 min-w-0">
                          <h4
                            className="truncate text-sm font-medium text-slate-900 dark:text-white"
                            title={item.productName}
                          >
                            {item.productName}
                          </h4>
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {item.productPrice === 0
                              ? "Free"
                              : `₦${item.productPrice.toLocaleString()}`}
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            if (!item.id) return;
                            const response = await cartApi.removeItem(item.id, {
                              product_type:
                                item.productType as BackendProductTypeDto,
                              product_id: item.productId,
                            });
                            setCartItems((prev) =>
                              prev.filter(
                                (cartItem) => cartItem.id !== item.id,
                              ),
                            );
                            if (response) {
                              await refreshCart();
                              window.dispatchEvent(new Event("cart-updated"));
                            }
                          }}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {/*<div className="mt-4 border-t border-black/[0.06] pt-4 dark:border-white/[0.06]">
                    {couponCode && (
                      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <span>Coupon ({couponCode}):</span>
                        <span>
                          -₦{getDiscountAmount().toLocaleString()} (
                          {discountPercentage}%)
                        </span>
                      </div>
                    )}
                    <div className="mb-4 flex items-center justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-lg">
                        ₦{getFinalTotal().toLocaleString()}
                      </span>
                    </div>
                    */}
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading
                      ? "Preparing checkout..."
                      : "Go to Checkout"}
                  </Button>
                  {/*</div>*/}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
