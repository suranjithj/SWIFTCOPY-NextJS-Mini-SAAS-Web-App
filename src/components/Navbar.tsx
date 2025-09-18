"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { Button } from "@/components/Button";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="w-full border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-bold text-xl flex items-center gap-2 text-gray-900 dark:text-gray-100"
        >
          <span className="inline-block h-3 w-3 rounded-full bg-blue-600" />
          SwiftCopy
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          <Link
            href="/pages/pricing"
            className="text-sm px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/pages/about"
            className="text-sm px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
          >
            About
          </Link>

          {status === "loading" ? (
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          ) : session ? (
            <>
              <Link
                href="/pages/post"
                className="text-sm px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >
                Make Post
              </Link>
              <Link
                href="/dashboard"
                className="text-sm px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >
                Dashboard
              </Link>
              
              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors">
                  <img
                    src={session.user?.image || "/default-avatar.png"}
                    alt={session.user?.name || "User"}
                    className="w-6 h-6 rounded-full"
                  />
                  {session.user?.name || "User"}
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link
                      href="/pages/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Settings
                    </Link>
                    <Link
                      href="/pages/billing"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Billing
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors"
              >
                Login
              </Link>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}

          {/* Theme Switch */}
          <ThemeSwitch />
        </div>
      </div>
    </nav>
  );
}
