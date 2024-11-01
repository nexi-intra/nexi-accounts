'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { accounts } from '@/app/api/entity/data';
import Link from 'next/link';
import { Button } from './ui/button';
import { APPNAME } from '@/app/global';

export function SimpleAccountSearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAccounts, setFilteredAccounts] = useState(accounts || []); // Default to empty array if accounts is undefined
  const router = useRouter();

  useEffect(() => {
    return
    if (accounts && Array.isArray(accounts)) { // Ensure accounts is defined and an array
      setFilteredAccounts(
        accounts.filter(account =>
          account.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery]);

  const handleSelect = (accountId: string) => {
    router.push(`/accounts/account/${accountId}`);
  };

  return (
    <div>
      {accounts?.sort((a, b) => a.name.localeCompare(b.name)).map((account, key) => <div key={key}>
        <Link href={`/${APPNAME}/account/${account.id}`}><Button variant={"link"}>{account.name}</Button> </Link>

      </div>
      )}
    </div>
  );
}
