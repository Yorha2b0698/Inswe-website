"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AccountHeader from "@/components/AccountHeader";
import { Pencil, X } from "lucide-react";

type Address = {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  postcode: string;
  country: string;
  isDefault: boolean;
};

type AddrForm = Omit<Address, "id">;

const emptyForm: AddrForm = {
  country: "United Kingdom",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  postcode: "",
  isDefault: false,
};

type Suggestion = {
  display_name: string;
  address: {
    house_number?: string;
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    postcode?: string;
    country?: string;
  };
};

export default function ProfilePage() {
  const router = useRouter();

  // ── Profile ──
  const [modalOpen, setModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [tempFirst, setTempFirst] = useState("");
  const [tempLast, setTempLast] = useState("");
  const email = "jane0908hill@outlook.com";

  const openModal = () => { setTempFirst(firstName); setTempLast(lastName); setModalOpen(true); };
  const handleSave = () => { setFirstName(tempFirst); setLastName(tempLast); setModalOpen(false); };
  const handleCancel = () => setModalOpen(false);
  const displayName = [firstName, lastName].filter(Boolean).join(" ");

  // ── Addresses ──
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addrOpen, setAddrOpen] = useState(false);
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);
  const [addrForm, setAddrForm] = useState<AddrForm>(emptyForm);

  // ── Address autocomplete ──
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (query.length < 3) { setSuggestions([]); setShowSuggestions(false); return; }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=6&countrycodes=gb,us,ca,au,de,fr,jp,kr,th`,
        { headers: { "Accept-Language": "en" } }
      );
      const data: Suggestion[] = await res.json();
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch {
      setSuggestions([]);
    }
  }, []);

  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAddrForm((prev) => ({ ...prev, address: value }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 350);
  };

  const handleSelectSuggestion = (s: Suggestion) => {
    const a = s.address;
    const streetParts = [a.house_number, a.road].filter(Boolean);
    const city = a.city || a.town || a.village || a.county || "";
    setAddrForm((prev) => ({
      ...prev,
      address: streetParts.join(" "),
      city,
      postcode: a.postcode || prev.postcode,
      country: a.country || prev.country,
    }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleAddrChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setAddrForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const openAddAddr = () => { setEditingAddr(null); setAddrForm(emptyForm); setSuggestions([]); setShowSuggestions(false); setAddrOpen(true); };
  const openEditAddr = (addr: Address) => { setEditingAddr(addr); setAddrForm({ ...addr }); setSuggestions([]); setShowSuggestions(false); setAddrOpen(true); };

  const handleAddrSave = () => {
    if (editingAddr) {
      setAddresses((prev) => prev.map((a) => (a.id === editingAddr.id ? { ...addrForm, id: editingAddr.id } : a)));
    } else {
      const newAddr: Address = { ...addrForm, id: Date.now().toString() };
      if (addresses.length === 0 || newAddr.isDefault) {
        setAddresses((prev) => [...prev.map((a) => ({ ...a, isDefault: false })), { ...newAddr, isDefault: true }]);
      } else {
        setAddresses((prev) => [...prev, newAddr]);
      }
    }
    setAddrOpen(false);
  };

  const handleAddrCancel = () => setAddrOpen(false);
  const handleSignOut = async () => { await fetch("/api/sign-out", { method: "POST" }); router.push("/auth/login"); };

  const defaultAddr = addresses.find((a) => a.isDefault);
  const otherAddrs = addresses.filter((a) => !a.isDefault);

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f7]">
      <AccountHeader active="profile" />

      <main className="mx-auto w-3/5 flex-1 px-6 py-8">
        <h1 className="mb-5 text-[21px] font-semibold tracking-[-0.02em] text-[#1a1a1a]">Profile</h1>

        {/* NAME + EMAIL CARD */}
        <div className="mb-3 rounded-2xl border border-[#e5e5e5] bg-white">
          <div className="px-5 py-[14px]">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="text-[13px] text-[#999]">Name</span>
              <button onClick={openModal} type="button" aria-label="Edit profile" className="flex cursor-pointer items-center border-none bg-transparent p-0 text-[#999] transition hover:text-[#1a1a1a]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
                  <path d="M9.19 2.31a1.5 1.5 0 0 1 2.12 0l.354.354a1.5 1.5 0 0 1 0 2.121l-6.477 6.477a1.5 1.5 0 0 1-.846.424l-1.737.252a.5.5 0 0 1-.567-.567l.252-1.737a1.5 1.5 0 0 1 .424-.846z" />
                  <path d="m8 3.5 1.237 1.237 1.238 1.238" />
                </svg>
              </button>
            </div>
            <p className="text-[13px] text-[#1a1a1a]">
              {displayName || <span className="text-[#bbb]">No name added</span>}
            </p>
          </div>
          <div className="mx-5 h-px bg-[#f0f0f0]" />
          <div className="px-5 py-[14px]">
            <p className="mb-1 text-[13px] text-[#999]">Email</p>
            <p className="text-[13px] text-[#1a1a1a]">{email}</p>
          </div>
        </div>

        {/* ADDRESSES CARD */}
        <div className="mb-6 rounded-2xl border border-[#e5e5e5] bg-white px-5 py-[14px]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[13px] font-medium text-[#1a1a1a]">Addresses</span>
            <button type="button" onClick={openAddAddr} className="flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-[13px] text-[#4a90e2]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M2 7h10M7 2v10" />
              </svg>
              <strong className="text-[13px] font-medium">Add</strong>
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="flex items-center gap-2 rounded-md bg-[#f5f5f5] px-3.5 py-2.5 text-[13px] text-[#888]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7" cy="7" r="5.5" />
                <path strokeLinejoin="round" d="M6.99 4.49h.02v.02h-.02z" />
                <path d="M7 9.75v-3" />
              </svg>
              No addresses added
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {defaultAddr && (
                <div className="rounded-lg border border-[#e5e5e5] px-4 py-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-medium uppercase tracking-wide text-[#888]">Default address</span>
                    <button onClick={() => openEditAddr(defaultAddr)} className="text-[#4a90e2] transition hover:opacity-70">
                      <Pencil size={13} strokeWidth={2} />
                    </button>
                  </div>
                  <div className="text-[13px] leading-[1.7] text-[#1a1a1a]">
                    <p>{[defaultAddr.firstName, defaultAddr.lastName].filter(Boolean).join(" ")}</p>
                    {defaultAddr.address && <p>{defaultAddr.address}</p>}
                    {defaultAddr.apartment && <p>{defaultAddr.apartment}</p>}
                    {defaultAddr.city && <p>{defaultAddr.city}</p>}
                    {defaultAddr.postcode && <p>{defaultAddr.postcode}</p>}
                    {defaultAddr.country && <p>{defaultAddr.country}</p>}
                  </div>
                </div>
              )}
              {otherAddrs.map((addr) => (
                <div key={addr.id} className="rounded-lg border border-[#e5e5e5] px-4 py-3">
                  <div className="mb-2 flex items-center justify-end">
                    <button onClick={() => openEditAddr(addr)} className="text-[#4a90e2] transition hover:opacity-70">
                      <Pencil size={13} strokeWidth={2} />
                    </button>
                  </div>
                  <div className="text-[13px] leading-[1.7] text-[#1a1a1a]">
                    <p>{[addr.firstName, addr.lastName].filter(Boolean).join(" ")}</p>
                    {addr.address && <p>{addr.address}</p>}
                    {addr.apartment && <p>{addr.apartment}</p>}
                    {addr.city && <p>{addr.city}</p>}
                    {addr.postcode && <p>{addr.postcode}</p>}
                    {addr.country && <p>{addr.country}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SIGN OUT */}
        <div className="mb-8 flex items-center gap-5">
          <button type="button" onClick={handleSignOut} className="cursor-pointer rounded-xl border border-[#d0d0d0] bg-white px-5 py-2.5 text-[13px] font-bold text-[#4a90e2] transition hover:bg-[#f5f5f5]">Sign out</button>
          <button type="button" onClick={handleSignOut} className="cursor-pointer border-none bg-transparent p-0 text-[13px] text-[#4a90e2] transition hover:opacity-70">Sign out of all devices</button>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="shrink-0 border-t border-[#e5e5e5] py-5">
        <div className="mx-auto flex w-3/5 items-center justify-center gap-5 px-6">
          <Link href="/policies/refund-policy" className="text-[11px] text-[#aaa] no-underline transition hover:text-[#555]">Refund policy</Link>
          <Link href="/policies/privacy-policy" className="text-[11px] text-[#aaa] no-underline transition hover:text-[#555]">Privacy policy</Link>
          <Link href="/policies/terms-of-service" className="text-[11px] text-[#aaa] no-underline transition hover:text-[#555]">Terms of service</Link>
        </div>
      </footer>

      {/* EDIT PROFILE MODAL */}
      {modalOpen && (
        <>
          <div onClick={handleCancel} className="fixed inset-0 z-40 bg-[rgba(80,80,80,0.5)] backdrop-blur-sm" />
          <div className="fixed left-1/2 top-1/2 z-50 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-[15px] bg-white px-6 pb-5 pt-5 shadow-[0_4px_24px_rgba(0,0,0,0.14)]">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[15px] font-semibold text-[#1a1a1a]">Edit profile</span>
              <button onClick={handleCancel} type="button" className="flex cursor-pointer items-center border-none bg-transparent p-0 text-[#aaa] transition hover:text-[#555]">
                <X size={17} strokeWidth={1.8} />
              </button>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-2">
              <input type="text" placeholder="First name" value={tempFirst} onChange={(e) => setTempFirst(e.target.value)} autoFocus className="h-10 w-full rounded-[9px] border border-[#d0d0d0] bg-white px-3 text-[13px] outline-none placeholder:text-[#bbb] focus:border-2 focus:border-[#4a90e2]" />
              <input type="text" placeholder="Last name" value={tempLast} onChange={(e) => setTempLast(e.target.value)} className="h-10 w-full rounded-[9px] border border-[#d0d0d0] bg-white px-3 text-[13px] outline-none placeholder:text-[#bbb] focus:border-2 focus:border-[#4a90e2]" />
            </div>
            <div className="border-b border-[#e8e8e8] pb-3">
              <p className="mb-0.5 text-[12px] text-[#999]">Email</p>
              <p className="text-[13px] text-[#1a1a1a]">{email}</p>
            </div>
            <p className="mb-5 mt-1.5 text-[11px] text-[#aaa]">This email is used for sign-in and order updates.</p>
            <div className="flex items-center justify-end gap-4">
              <button onClick={handleCancel} type="button" className="cursor-pointer border-none bg-transparent p-0 text-[13px] text-[#4a90e2] underline underline-offset-2">Cancel</button>
              <button onClick={handleSave} type="button" className="cursor-pointer border-none bg-transparent p-0 text-[13px] font-medium text-[#1a1a1a]">Save</button>
            </div>
          </div>
        </>
      )}

      {/* ADD / EDIT ADDRESS MODAL */}
      {addrOpen && (
        <>
          <div onClick={handleAddrCancel} className="fixed inset-0 z-40 bg-[rgba(80,80,80,0.5)] backdrop-blur-sm" />
          <div className="fixed left-1/2 top-1/2 z-50 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white px-6 pb-6 pt-5 shadow-[0_8px_32px_rgba(0,0,0,0.18)]">

            {/* Title + close */}
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[16px] font-semibold text-[#1a1a1a]">{editingAddr ? "Edit address" : "Add address"}</span>
              <button onClick={handleAddrCancel} type="button" className="flex cursor-pointer items-center border-none bg-transparent p-0 text-[#aaa] transition hover:text-[#555]">
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>

            {/* Country */}
            <div className="mb-3">
              <label className="mb-0.5 block text-[11px] text-[#888]">Country/region</label>
              <div className="relative">
                <select name="country" value={addrForm.country} onChange={handleAddrChange} className="h-11 w-full appearance-none rounded-lg border border-[#d0d0d0] bg-white px-3 text-[14px] text-[#222] outline-none focus:border-[#4a90e2]">
                  <option>United Kingdom</option>
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>Germany</option>
                  <option>France</option>
                  <option>Japan</option>
                  <option>South Korea</option>
                  <option>Thailand</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#888]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>

            {/* First + Last */}
            <div className="mb-3 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-0.5 block text-[11px] text-[#888]">First name</label>
                <input type="text" name="firstName" placeholder="First name" value={addrForm.firstName} onChange={handleAddrChange} className="h-11 w-full rounded-lg border border-[#d0d0d0] bg-white px-3 text-[14px] outline-none placeholder:text-[#bbb] focus:border-2 focus:border-[#4a90e2]" />
              </div>
              <div>
                <label className="mb-0.5 block text-[11px] text-[#888]">Last name</label>
                <input type="text" name="lastName" placeholder="Last name" value={addrForm.lastName} onChange={handleAddrChange} className="h-11 w-full rounded-lg border border-[#d0d0d0] bg-white px-3 text-[14px] outline-none placeholder:text-[#bbb] focus:border-2 focus:border-[#4a90e2]" />
              </div>
            </div>

            {/* Address with suggestions */}
            <div className="mb-3">
              <label className="mb-0.5 block text-[11px] text-[#888]">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={addrForm.address}
                onChange={handleAddressInput}
                autoComplete="off"
                className="h-11 w-full rounded-lg border-2 border-[#4a90e2] bg-white px-3 text-[14px] outline-none placeholder:text-[#bbb]"
              />

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="mt-0 rounded-b-lg border border-t-0 border-[#d0d0d0] bg-white shadow-lg">
                  <div className="flex items-center justify-between border-b border-[#f0f0f0] px-4 py-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#aaa]">Suggestions</span>
                    <button
                      type="button"
                      onClick={() => { setSuggestions([]); setShowSuggestions(false); }}
                      className="text-[#aaa] transition hover:text-[#555]"
                    >
                      <X size={14} strokeWidth={2} />
                    </button>
                  </div>
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="block w-full px-4 py-3 text-left text-[13px] font-semibold text-[#1a1a1a] transition hover:bg-[#f5f5f5]"
                    >
                      {s.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Apartment */}
            <input type="text" name="apartment" placeholder="Apartment, suite, etc. (optional)" value={addrForm.apartment} onChange={handleAddrChange} className="mb-3 h-11 w-full rounded-lg border border-[#d0d0d0] bg-white px-3 text-[14px] outline-none placeholder:text-[#bbb] focus:border-[#4a90e2]" />

            {/* City + Postcode */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <input type="text" name="city" placeholder="City" value={addrForm.city} onChange={handleAddrChange} className="h-11 w-full rounded-lg border border-[#d0d0d0] bg-white px-3 text-[14px] outline-none placeholder:text-[#bbb] focus:border-[#4a90e2]" />
              <input type="text" name="postcode" placeholder="Postcode" value={addrForm.postcode} onChange={handleAddrChange} className="h-11 w-full rounded-lg border border-[#d0d0d0] bg-white px-3 text-[14px] outline-none placeholder:text-[#bbb] focus:border-[#4a90e2]" />
            </div>

            {/* Default checkbox */}
            <label className="mb-5 flex cursor-pointer items-center gap-2.5 text-[13px] text-[#444]">
              <input type="checkbox" name="isDefault" checked={addrForm.isDefault} onChange={handleAddrChange} className="h-4 w-4 cursor-pointer accent-[#4a90e2]" />
              This is my default address
            </label>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
              <button onClick={handleAddrCancel} type="button" className="cursor-pointer border-none bg-transparent p-0 text-[14px] text-[#4a90e2] underline underline-offset-2">Cancel</button>
              <button onClick={handleAddrSave} type="button" className="h-10 cursor-pointer rounded-lg bg-[#4a90e2] px-6 text-[14px] font-medium text-white transition hover:bg-[#3a7fd0]">Save</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
