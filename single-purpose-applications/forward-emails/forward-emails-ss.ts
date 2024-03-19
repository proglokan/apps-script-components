"use strict";

// * Get email threads from the active user's Gmail
function getEmailThreads(query: string): GoogleAppsScript.Gmail.GmailThread[] | null {
  const emailThreads: GoogleAppsScript.Gmail.GmailThread[] = GmailApp.search(query);
  if (!emailThreads.length) return null;

  return emailThreads;
}

// * Forward messages to a recipient
function forwardMessages(emailThreads: GoogleAppsScript.Gmail.GmailThread[], recipient: string): void {
  for (let x = 0; x < emailThreads.length; ++x) {
    const emailThread = emailThreads[x];
    const messages = emailThread.getMessages();
    if (messages.length > 1) continue;
    const message = messages[0];
    message.forward(recipient);
  }
}

// * Mark email threads as read so they aren't forwarded twice
function markEmailThreadsAsRead(emailThreads: GoogleAppsScript.Gmail.GmailThread[]): void {
  for (let x = 0; x < emailThreads.length; ++x) {
    const emailThread = emailThreads[x];
    emailThread.markRead();
  }
}

// * Check for unread emails from a list of senders and forward them to a recipient specified at author-time
function fowardEmailsMain() {
  const query = "is:unread from:jasonp@todaysconcept.com OR moshe@mschw.com OR rldeals20@gmail.com OR isaaclandau1@gmail.com OR raisie@lorecs.com";
  const emailThreads: GoogleAppsScript.Gmail.GmailThread[] | null = getEmailThreads(query);
  if (!emailThreads) return;
  const recipient = "deals@proglo.biz";
  forwardMessages(emailThreads, recipient);
  markEmailThreadsAsRead(emailThreads);
}
