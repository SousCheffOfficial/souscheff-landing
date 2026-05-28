// Thanks page logic

document.addEventListener('DOMContentLoaded', function() {
  // Get referral code from URL
  const urlParams = new URLSearchParams(window.location.search);
  console.log('🔍 Full URL:', window.location.href);
  console.log('🔍 refCode from URL:', urlParams.get('ref'));
  console.log('🔍 pos from URL:', urlParams.get('pos'));
  const refCode = urlParams.get('ref');
  
  // If no ref param, redirect to index
  if (!refCode) {
    window.location.href = 'index.html';
    return;
  }
  
  // Trigger confetti (toned down, warm colors)
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#B85827', '#2B1F14', '#9B8666'],
    gravity: 1.5,
    drift: 0.3
  });
  
  // Fetch user data from Supabase
  async function loadUserData() {
    let data = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (!data && attempts < maxAttempts) {
      attempts++;
      try {
        const result = await sb
          .from('signups')
          .select('ref_code, referral_count, position, created_at')
          .eq('ref_code', refCode)
          .maybeSingle();

        console.log('🔍 Attempt', attempts, 'returned:', result);

        if (result.data) {
          data = result.data;
          break;
        }

        if (result.error) {
          console.error('🔍 Supabase error on attempt', attempts, ':', result.error);
        }
      } catch (e) {
        console.error('🔍 Exception on attempt', attempts, ':', e);
      }

      if (!data && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log('🔍 Final data:', data);

    if (!data) {
      document.getElementById('error-state').classList.remove('hidden');
      document.getElementById('main-content').classList.add('hidden');
      return;
    }

    const position = data.position || 1;
    const referralCount = data.referral_count || 0;

    document.getElementById('position').textContent = position;
    document.getElementById('referral-count').textContent = referralCount;
    document.getElementById('spots-skipped').textContent = referralCount * 10;

    if (position <= 10) {
      document.getElementById('current-rank').textContent = '#' + position;
    } else {
      document.getElementById('current-rank').textContent = 'Not yet on leaderboard';
    }

    const shareUrl = window.location.origin + '/?ref=' + refCode;
    document.getElementById('share-url').value = shareUrl;

    const twitterUrl = 'https://twitter.com/intent/tweet?text=I%27m%20fixing%20my%20%241%2C500%2Fyear%20food%20waste%20problem%20with%20%40SousCheff.%20Skip%20the%20line%3A%20' + encodeURIComponent(shareUrl);
    const whatsappUrl = 'https://wa.me/?text=I%27m+fixing+my+food+waste+problem+with+SousCheff.+Skip+the+line%3A+' + encodeURIComponent(shareUrl);
    const smsUrl = 'sms:?body=Stop%20wasting%20%241%2C500%2Fyear%20on%20food.%20SousCheff%20waitlist%3A+' + encodeURIComponent(shareUrl);

    document.getElementById('twitter-btn').href = twitterUrl;
    document.getElementById('whatsapp-btn').href = whatsappUrl;
    document.getElementById('sms-btn').href = smsUrl;
  }
  
  loadUserData();
  
  // Copy link functionality
  const copyBtn = document.getElementById('copy-btn');
  const shareUrl = document.getElementById('share-url');
  
  copyBtn.addEventListener('click', async function() {
    try {
      await navigator.clipboard.writeText(shareUrl.value);
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i data-lucide="check" style="width: 16px; height: 16px;"></i> Copied';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      
      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      shareUrl.select();
      document.execCommand('copy');
      const originalHTML = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i data-lucide="check" style="width: 16px; height: 16px;"></i> Copied';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      
      setTimeout(() => {
        copyBtn.innerHTML = originalHTML;
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 1500);
    }
  });
});