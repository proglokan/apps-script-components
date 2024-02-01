'use strict';

// @subroutine {Function} Pure: string → get email threads from the active user's Gmail
// @arg {string} query → Gmail query
function getEmailThreads(query: string): GoogleAppsScript.Gmail.GmailThread[] | null {
	const emailThreads: GoogleAppsScript.Gmail.GmailThread[] = GmailApp.search(query);
	if (!emailThreads.length) return null;
	return emailThreads;
}

// @subroutine {Procedure} Void → forward messages to a recipient
// @arg {GoogleAppsScript.Gmail.GmailThread[]} emailThreads → email threads to forward
// @arg {string} recipient → recipient to forward the messages to
function forwardMessages(emailThreads: GoogleAppsScript.Gmail.GmailThread[], recipient: string): void {
	for (let x = 0; x < emailThreads.length; ++x) {
		const emailThread = emailThreads[x];
		const messages = emailThread.getMessages();
		if (messages.length > 1) continue;
		const message = messages[0];
		message.forward(recipient);
	}
}

// @subroutine {Procedure} Void → mark email threads as read so they aren't forwarded twice
// @arg {GoogleAppsScript.Gmail.GmailThread[]} emailThreads → email threads to forward
function markEmailThreadsAsRead(emailThreads: GoogleAppsScript.Gmail.GmailThread[]): void {
	for (let x = 0; x < emailThreads.length; ++x) {
		const emailThread = emailThreads[x];
		emailThread.markRead();
	}
}

// @subroutine {Helper} Void → check for unread emails from a list of senders and forward them to a recipient specified at author-time
function fowardEmailsMain() {
	const query = 'is:unread from:jasonp@todaysconcept.com OR moshe@mschw.com OR rldeals20@gmail.com OR isaaclandau1@gmail.com OR raisie@lorecs.com';
	const emailThreads: GoogleAppsScript.Gmail.GmailThread[] |  null = getEmailThreads(query);
	if (!emailThreads) return;
	const recipient = 'deals@proglo.biz';
	forwardMessages(emailThreads, recipient);
	markEmailThreadsAsRead(emailThreads);
}