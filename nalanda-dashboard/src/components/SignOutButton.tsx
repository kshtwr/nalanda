"use client"
import { createClient } from "@/utils/supabase/client";
import {useEffect} from 'react';

const EXTENSION_ID = "bekpiokeecdinophabjeianginppegdf"
const supabase = createClient();

export default function SignOut(){

    async function signOut(){
        await supabase.auth.signOut({ scope: 'local' });
        window.location.href = '/login'
    }

    useEffect(() => {
        async function syncSession(){
            const { data: { session } } = await supabase.auth.getSession();
            (window as any).chrome?.runtime?.sendMessage(EXTENSION_ID, { type: 'supabaseSession', session });
        }
        syncSession();
      }, []); 

    return <button onClick={signOut} className="text-sm text-gray-500 hover:text-gray-800 cursor-pointer border rounded-sm px-3 py-1">
        Sign out
    </button>
}
