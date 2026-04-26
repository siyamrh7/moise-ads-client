// Defines what each role can do at each status.
// Mirror of server/src/routes/ads.js isTransitionAllowed.

export function getAvailableActions(ad, currentUser) {
  const u = currentUser;
  const actions = [];

  if (ad.status === 'idea') {
    if (u === 'ray' || u === 'agency') {
      actions.push({
        id: 'submit',
        label: 'Submit for review',
        style: 'primary',
        newStatus: 'review',
        hint: u === 'ray' ? 'Send to agency for approval.' : 'Send to Ray for approval.',
        systemMessage: (u === 'ray' ? 'Ray' : 'Agency') + ' submitted the idea for review.'
      });
    }
    if (u === 'ray') {
      actions.push({
        id: 'deploy-direct',
        label: '⚡ Deploy directly',
        style: 'approve',
        newStatus: 'live',
        hint: 'Skip review and production. Requires a Drive link.',
        requiresDrive: true,
        systemMessage: 'Ray: deployed directly to live (skipped review & production).'
      });
    }
  }

  if (ad.status === 'review') {
    const reviewer = ad.createdBy === 'ray' ? 'agency' : 'ray';
    if (u === reviewer) {
      actions.push({
        id: 'approve', label: '✓ Approve', style: 'approve', newStatus: 'production',
        hint: 'Move to production.',
        systemMessage: (u === 'ray' ? 'Ray' : 'Agency') + ' approved the idea.'
      });
      actions.push({
        id: 'feedback', label: 'Request changes', style: 'secondary', newStatus: 'feedback',
        hint: 'Send back with feedback.',
        systemMessage: (u === 'ray' ? 'Ray' : 'Agency') + ' requested changes.'
      });
      actions.push({
        id: 'reject', label: '✗ Reject', style: 'reject', newStatus: 'archive',
        hint: 'Reject the idea entirely (archived).',
        systemMessage: (u === 'ray' ? 'Ray' : 'Agency') + ' rejected the idea.'
      });
    }
  }

  if (ad.status === 'feedback' && u === ad.createdBy) {
    actions.push({
      id: 'resubmit', label: 'Resubmit', style: 'primary', newStatus: 'review',
      hint: 'Send back to review after addressing feedback.',
      systemMessage: (u === 'ray' ? 'Ray' : 'Agency') + ' resubmitted after feedback.'
    });
  }

  if (ad.status === 'production' && u === 'agency') {
    actions.push({
      id: 'mark-ready', label: 'Mark as ready', style: 'primary', newStatus: 'ready',
      hint: 'Drive link required.', requiresDrive: true,
      systemMessage: 'Agency: marked as ready for final review.'
    });
  }

  if (ad.status === 'ready' && u === 'ray') {
    actions.push({
      id: 'go-live', label: '✓ Set live', style: 'approve', newStatus: 'live',
      hint: 'Approve and run.',
      systemMessage: 'Ray: set ad live.'
    });
    actions.push({
      id: 'back-to-prod', label: 'Back to production', style: 'secondary', newStatus: 'production',
      hint: 'Send back for changes.',
      systemMessage: 'Ray: sent back to production.'
    });
  }

  if (ad.status === 'live' && u === 'ray') {
    actions.push({
      id: 'pause', label: 'Pause', style: 'secondary', newStatus: 'paused',
      hint: 'Stop running this ad.',
      systemMessage: 'Ray: paused the ad.'
    });
  }

  if (ad.status === 'paused' && u === 'ray') {
    actions.push({
      id: 'resume', label: 'Resume', style: 'approve', newStatus: 'live',
      hint: 'Set the ad back to live.',
      systemMessage: 'Ray: resumed the ad.'
    });
    actions.push({
      id: 'archive', label: 'Archive', style: 'secondary', newStatus: 'archive',
      hint: 'Permanently move to archive.',
      systemMessage: 'Ray: archived the ad.'
    });
  }

  return actions;
}

export function whoIsWaiting(ad) {
  switch (ad.status) {
    case 'idea': return ad.createdBy;
    case 'review': return ad.createdBy === 'ray' ? 'agency' : 'ray';
    case 'feedback': return ad.createdBy;
    case 'production': return 'agency';
    case 'ready': return 'ray';
    default: return null;
  }
}

export function isActionNeeded(ad, currentUser) {
  return whoIsWaiting(ad) === currentUser;
}

export function statusBannerText(ad, currentUser) {
  const waiting = whoIsWaiting(ad);
  const isWaiter = waiting === currentUser;
  const otherName = waiting === 'ray' ? 'Ray' : 'Agency';

  switch (ad.status) {
    case 'idea': return isWaiter
      ? { title: 'Idea — not yet submitted', hint: 'Flesh it out and submit for review.' }
      : { title: 'Idea — being written', hint: `Waiting for ${otherName}.` };
    case 'review': return isWaiter
      ? { title: 'Your review is needed', hint: 'Read and approve, request changes, or reject.' }
      : { title: 'Waiting for review', hint: `With ${otherName}.` };
    case 'feedback': return isWaiter
      ? { title: 'Changes requested', hint: 'Process the feedback and resubmit.' }
      : { title: 'Waiting for changes', hint: `${otherName} is processing feedback.` };
    case 'production': return isWaiter
      ? { title: 'In production — your turn', hint: 'Create content, upload to Drive, mark ready.' }
      : { title: 'In production', hint: 'Agency is creating the content.' };
    case 'ready': return isWaiter
      ? { title: 'Ready for final review', hint: 'Check Drive, set live or send back.' }
      : { title: 'Waiting for Ray', hint: 'Final review on Drive.' };
    case 'live': return { title: 'Running live', hint: 'Active on Meta.' };
    case 'paused': return { title: 'Paused', hint: 'Not running. Can be resumed or archived.' };
    case 'archive': return { title: 'Archived', hint: 'No longer active.' };
    default: return { title: ad.status, hint: '' };
  }
}
