import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
    try {
        const payload = await req.json()
        const { record } = payload

        // record: { id, chat_id, sender_id, content }

        // 1. Initialize Supabase
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 2. Get Chat and Receiver Info
        const { data: chat, error: chatError } = await supabase
            .from('chats')
            .select('*, listings(title), buyer:buyer_id(id, full_name, phone), seller:seller_id(id, full_name, phone)')
            .eq('id', record.chat_id)
            .single()

        if (chatError || !chat) throw chatError

        // 3. Determine who is the recipient (the one who didn't send the message)
        const recipient = record.sender_id === chat.buyer_id ? chat.seller : chat.buyer
        const senderName = record.sender_id === chat.buyer_id ? chat.buyer.full_name : chat.seller.full_name

        if (!recipient.phone) {
            return new Response(JSON.stringify({ message: "Recipient has no phone registered" }), { status: 200 })
        }

        // 4. Send WhatsApp via Twilio
        const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
        const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN')
        const twilioFromNumber = Deno.env.get('TWILIO_FROM_NUMBER') || '+14155238886'

        const messageBody = `🏠 Habitech Avisos: ${senderName} te escribió sobre "${chat.listings.title}": "${record.content}". Responde aquí: https://habitech-marketplace.netlify.app/mensajes?chatId=${record.chat_id}`

        const twilioResponse = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa(`${twilioAccountSid}:${twilioAuthToken}`),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                "To": `whatsapp:+${recipient.phone}`,
                "From": `whatsapp:${twilioFromNumber}`,
                "Body": messageBody
            })
        })

        const twilioResult = await twilioResponse.json()

        return new Response(JSON.stringify({ success: true, twilio: twilioResult }), {
            headers: { "Content-Type": "application/json" }
        })

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        })
    }
})
