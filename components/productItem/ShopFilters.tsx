"use client";

import {
    Dispatch,
    SetStateAction,
    useState,
    useRef,
    useEffect,
} from "react";
import { ChevronDown } from "lucide-react";
import { Product } from "./ProductSection";

interface ShopFiltersProps {
    products: Product[];
    view: "default" | "zoom-out";
    setView: Dispatch<
        SetStateAction<"default" | "zoom-out">
    >;
    sort: string;
    setSort: Dispatch<SetStateAction<string>>;
    setFilteredProducts: Dispatch<
        SetStateAction<Product[]>
    >;
}

const sortOptions = [
    { label: "Featured", value: "manual" },
    { label: "Most relevant", value: "most-relevant" },
    { label: "Best selling", value: "best-selling" },
    {
        label: "Alphabetically, A-Z",
        value: "title-ascending",
    },
    {
        label: "Alphabetically, Z-A",
        value: "title-descending",
    },
    {
        label: "Price, low to high",
        value: "price-ascending",
    },
    {
        label: "Price, high to low",
        value: "price-descending",
    },
    {
        label: "Date, old to new",
        value: "created-ascending",
    },
    {
        label: "Date, new to old",
        value: "created-descending",
    },
];

export default function ShopFilters({
    products,
    view,
    setView,
    sort,
    setSort,
    setFilteredProducts,
}: ShopFiltersProps) {
    const [sortOpen, setSortOpen] =
        useState(false);

    const [priceOpen, setPriceOpen] =
        useState(false);

    const [minPrice, setMinPrice] =
        useState("");

    const [maxPrice, setMaxPrice] =
        useState("");

    const [availability, setAvailability] =
        useState({
            inStock: false,
            outOfStock: false,
        });

    const sortRef = useRef<HTMLDivElement>(null);

    // CLOSE SORT DROPDOWN
    useEffect(() => {
        function handleClickOutside(
            e: MouseEvent
        ) {
            if (
                sortRef.current &&
                !sortRef.current.contains(
                    e.target as Node
                )
            ) {
                setSortOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    // SORT
    const handleSort = (value: string) => {
        setSort(value);

        const copied = [...products];

        if (value === "title-ascending") {
            copied.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
        }

        if (value === "title-descending") {
            copied.sort((a, b) =>
                b.name.localeCompare(a.name)
            );
        }

        if (value === "price-ascending") {
            copied.sort(
                (a, b) => a.price - b.price
            );
        }

        if (value === "price-descending") {
            copied.sort(
                (a, b) => b.price - a.price
            );
        }

        setFilteredProducts(copied);
        setSortOpen(false);
    };

    // PRICE FILTER
    const applyPriceFilter = () => {
        const filtered = products.filter(
            (product) => {
                const min =
                    minPrice === ""
                        ? 0
                        : Number(minPrice);

                const max =
                    maxPrice === ""
                        ? Infinity
                        : Number(maxPrice);

                return (
                    product.price >= min &&
                    product.price <= max
                );
            }
        );

        setFilteredProducts(filtered);
        setPriceOpen(false);
    };

    // AVAILABILITY FILTER
    useEffect(() => {
        let filtered = [...products];

        if (
            availability.inStock &&
            !availability.outOfStock
        ) {
            filtered = filtered.filter(
                (product) => product.inStock
            );
        }

        if (
            !availability.inStock &&
            availability.outOfStock
        ) {
            filtered = filtered.filter(
                (product) => !product.inStock
            );
        }

        setFilteredProducts(filtered);
    }, [availability, products, setFilteredProducts]);

    return (
        <div className="mb-10 flex items-center justify-between text-[14px]">
            {/* LEFT */}
            <div className="flex items-center gap-8">
                {/* AVAILABILITY */}
                <div className="relative">
                    <details className="group">
                        {/* HEADER */}
                        <summary className="flex cursor-pointer list-none items-center gap-1 text-[14px] text-black">
                            <span>Availability</span>

                            {(availability.inStock ||
                                availability.outOfStock) && (
                                    <span className="text-[12px] text-gray-500">
                                        {availability.inStock &&
                                            "In stock"}

                                        {availability.inStock &&
                                            availability.outOfStock &&
                                            ", "}

                                        {availability.outOfStock &&
                                            "Out of stock"}
                                    </span>
                                )}

                            <span className="mt-[1px]">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                    className="transition duration-200 group-open:rotate-180"
                                >
                                    <path
                                        d="M11 5.5L7 9.5L3 5.5"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                        </summary>

                        {/* DROPDOWN */}
                        <div className="absolute left-0 top-[36px] z-50 w-[150px] rounded-md border border-[#e5e5e5] bg-white p-4 shadow-xl">
                            <div className="space-y-2">
                                {/* IN STOCK */}
                                <label className="flex cursor-pointer items-center gap-3 py-1">
                                    <input
                                        type="checkbox"
                                        checked={
                                            availability.inStock
                                        }
                                        onChange={(e) =>
                                            setAvailability(
                                                (prev) => ({
                                                    ...prev,
                                                    inStock:
                                                        e.target
                                                            .checked,
                                                })
                                            )
                                        }
                                        className="hidden"
                                    />

                                    <div
                                        className={`flex h-[15px] w-[15px] items-center justify-center border transition ${availability.inStock
                                            ? "border-black bg-black text-white"
                                            : "border-[#cfcfcf] bg-white"
                                            }`}
                                    >
                                        {availability.inStock && (
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                            >
                                                <path
                                                    d="M4.75439 10.7485L7.68601 14.5888C7.79288 14.7288 7.84632 14.7988 7.91174 14.8242C7.96907 14.8466 8.03262 14.8469 8.09022 14.8253C8.15596 14.8007 8.21026 14.7314 8.31886 14.5927L15.2475 5.74658"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        )}
                                    </div>

                                    <span className="text-[14px] text-black">
                                        In stock
                                    </span>
                                </label>

                                {/* OUT OF STOCK */}
                                <label className="flex cursor-pointer items-center gap-3 py-1">
                                    <input
                                        type="checkbox"
                                        checked={
                                            availability.outOfStock
                                        }
                                        onChange={(e) =>
                                            setAvailability(
                                                (prev) => ({
                                                    ...prev,
                                                    outOfStock:
                                                        e.target
                                                            .checked,
                                                })
                                            )
                                        }
                                        className="hidden"
                                    />

                                    <div
                                        className={`flex h-[15px] w-[15px] items-center justify-center border transition ${availability.outOfStock
                                            ? "border-black bg-black text-white"
                                            : "border-[#cfcfcf] bg-white"
                                            }`}
                                    >
                                        {availability.outOfStock && (
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                            >
                                                <path
                                                    d="M4.75439 10.7485L7.68601 14.5888C7.79288 14.7288 7.84632 14.7988 7.91174 14.8242C7.96907 14.8466 8.03262 14.8469 8.09022 14.8253C8.15596 14.8007 8.21026 14.7314 8.31886 14.5927L15.2475 5.74658"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        )}
                                    </div>

                                    <span className="text-[14px] text-black">
                                        Out of stock
                                    </span>
                                </label>
                            </div>

                            {/* CLEAR */}
                            {(availability.inStock ||
                                availability.outOfStock) && (
                                    <button
                                        onClick={() =>
                                            setAvailability({
                                                inStock: false,
                                                outOfStock: false,
                                            })
                                        }
                                        className="mt-4 text-[13px] font-medium text-black underline"
                                    >
                                        Clear
                                    </button>
                                )}
                        </div>
                    </details>
                </div>

                {/* PRICE */}
                <div className="relative">
                    <button
                        onClick={() =>
                            setPriceOpen(!priceOpen)
                        }
                        className="flex items-center gap-2 text-[15px]"
                    >
                        <span>Price</span>

                        <ChevronDown
                            size={16}
                            className={`transition duration-200 ${priceOpen
                                ? "rotate-180"
                                : ""
                                }`}
                        />
                    </button>

                    {priceOpen && (
                        <div className="absolute left-0 top-10 z-50 w-[340px] border border-[#e5e5e5] bg-white p-5 shadow-xl">
                            <div className="flex items-center gap-4">
                                {/* MIN */}
                                <div className="flex-1">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={minPrice}
                                            onChange={(e) =>
                                                setMinPrice(
                                                    e.target.value
                                                )
                                            }
                                            className="h-[48px] w-full border border-[#dcdcdc] px-10 text-[14px] outline-none focus:border-black"
                                        />

                                        <label className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]">
                                            £
                                        </label>
                                    </div>
                                </div>

                                <div className="text-[#666]">
                                    to
                                </div>

                                {/* MAX */}
                                <div className="flex-1">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="84.99"
                                            value={maxPrice}
                                            onChange={(e) =>
                                                setMaxPrice(
                                                    e.target.value
                                                )
                                            }
                                            className="h-[48px] w-full border border-[#dcdcdc] px-10 text-[14px] outline-none focus:border-black"
                                        />

                                        <label className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666]">
                                            £
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 text-[14px] text-[#666]">
                                The highest price is £84.99
                            </div>

                            <div className="mt-5 flex items-center gap-4">
                                <button
                                    onClick={applyPriceFilter}
                                    className="h-[42px] bg-black px-6 text-[14px] text-white"
                                >
                                    Apply
                                </button>

                                <button
                                    onClick={() => {
                                        setMinPrice("");
                                        setMaxPrice("");
                                        setFilteredProducts(
                                            products
                                        );
                                    }}
                                    className="text-[14px] underline"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-6">
                <span className="text-gray-500">
                    {products.length} items
                </span>

                {/* SORT */}
                <div
                    className="relative"
                    ref={sortRef}
                >
                    <button
                        onClick={() =>
                            setSortOpen(!sortOpen)
                        }
                        className="flex items-center gap-1"
                    >
                        <span>Sort</span>

                        <ChevronDown
                            size={16}
                            className={`transition ${sortOpen
                                ? "rotate-180"
                                : ""
                                }`}
                        />
                    </button>

                    {sortOpen && (
                        <div className="absolute right-0 top-10 z-50 w-[280px] rounded-xl bg-white p-2 shadow-xl">
                            {sortOptions.map((option) => (
                                <label
                                    key={option.value}
                                    className="flex cursor-pointer items-center rounded-md px-3 py-2 hover:bg-gray-100"
                                >
                                    <input
                                        type="radio"
                                        name="sort_by"
                                        value={option.value}
                                        checked={
                                            sort === option.value
                                        }
                                        onChange={() =>
                                            handleSort(
                                                option.value
                                            )
                                        }
                                        className="hidden"
                                    />

                                    <span className="mr-3 w-[20px]">
                                        {sort ===
                                            option.value && (
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M4.7 10.7L7.7 14.6C7.9 14.8 8.1 14.8 8.3 14.6L15.2 5.7"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            )}
                                    </span>

                                    <span className="text-[14px]">
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* GRID ICONS */}
                <div className="flex items-center gap-3">
                    {/* 4 GRID */}
                    <button
                        onClick={() =>
                            setView("default")
                        }
                        className={`grid grid-cols-2 gap-[2px] ${view === "default"
                            ? "opacity-100"
                            : "opacity-40"
                            }`}
                    >
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="h-[6px] w-[6px] bg-gray-700"
                            />
                        ))}
                    </button>

                    {/* 9 GRID */}
                    <button
                        onClick={() =>
                            setView("zoom-out")
                        }
                        className={`grid grid-cols-3 gap-[2px] ${view === "zoom-out"
                            ? "opacity-100"
                            : "opacity-40"
                            }`}
                    >
                        {[...Array(9)].map((_, i) => (
                            <div
                                key={i}
                                className="h-[4px] w-[4px] bg-gray-500"
                            />
                        ))}
                    </button>
                </div>
            </div>
        </div >
    );
}