// Leaderboard page logic

document.addEventListener('DOMContentLoaded', function() {
  async function loadLeaderboard() {
    try {
      const { data, error } = await sb
        .from('signups')
        .select('email, referral_count')
        .order('referral_count', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error loading leaderboard:', error);
        document.getElementById('error-state').classList.remove('hidden');
        document.getElementById('leaderboard-content').classList.add('hidden');
        return;
      }
      
      // Render leaderboard rows
      const tbody = document.getElementById('leaderboard-body');
      tbody.innerHTML = '';
      
      data.forEach((item, index) => {
        const rank = index + 1;
        const maskedEmail = maskEmail(item.email);
        const hasReferrals = item.referral_count > 0;
        
        // Determine rank styling
        let rankClass = 'leaderboard-rank leaderboard-rank-other';
        
        if (rank === 1) {
          rankClass = 'leaderboard-rank leaderboard-rank-1';
        }
        
        const row = document.createElement('div');
        row.className = 'leaderboard-row';
        row.innerHTML = `
          <span class="${rankClass}">#${rank}</span>
          <span class="leaderboard-email">${maskedEmail}</span>
          ${hasReferrals ? `<span class="leaderboard-count">${item.referral_count}</span><span class="leaderboard-label">referrals</span>` : '<span class="leaderboard-count" style="color: var(--color-text-faint);">—</span>'}
        `;
        
        tbody.appendChild(row);
      });
      
    } catch (err) {
      console.error('Error loading leaderboard:', err);
      document.getElementById('error-state').classList.remove('hidden');
      document.getElementById('leaderboard-content').classList.add('hidden');
    }
  }
  
  // Function to mask email
  function maskEmail(email) {
    const [local, domain] = email.split('@');
    if (local.length <= 3) {
      return `${local}***@${domain}`;
    }
    return `${local.substring(0, 3)}***@${domain}`;
  }
  
  loadLeaderboard();
});