"use strict";
// * Get email threads from the active user's Gmail
const getEmailThreads = (query) => {
    const emailThreads = GmailApp.search(query);
    if (!emailThreads.length)
        return null;
    return emailThreads;
};
// * Forward messages to a recipient
const forwardMessages = (emailThreads, recipient) => {
    for (let x = 0; x < emailThreads.length; ++x) {
        const emailThread = emailThreads[x];
        const messages = emailThread.getMessages();
        if (messages.length > 1)
            continue;
        const message = messages[0];
        message.forward(recipient);
    }
};
// * Mark email threads as read so they aren't forwarded twice
const markEmailThreadsAsRead = (emailThreads) => {
    for (let x = 0; x < emailThreads.length; ++x) {
        const emailThread = emailThreads[x];
        emailThread.markRead();
    }
};
// * Check for unread emails from a list of senders and forward them to a recipient specified at author-time
const fowardEmailsMain = () => {
    const query = "is:unread from:jasonp@todaysconcept.com OR moshe@mschw.com OR rldeals20@gmail.com OR isaaclandau1@gmail.com OR raisie@lorecs.com";
    const emailThreads = getEmailThreads(query);
    if (!emailThreads)
        return;
    const recipient = "deals@proglo.biz";
    forwardMessages(emailThreads, recipient);
    markEmailThreadsAsRead(emailThreads);
};
//# sourceMappingURL=forward-emails-ss.js.map