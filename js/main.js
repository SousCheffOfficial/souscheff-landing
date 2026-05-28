// Signup form logic for index.html

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('signup-form');
  const emailInput = document.getElementById('email');
  const submitBtn = document.getElementById('submit-btn');
  const errorMessage = document.getElementById('error-message');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Clear previous error
    errorMessage.textContent = '';
    errorMessage.classList.add('hidden');
    
    // Validate email
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      errorMessage.textContent = 'Please enter a valid email.';
      errorMessage.classList.remove('hidden');
      return;
    }
    
    // Set loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Getting you on...';
    
    try {
      // Get referral code from URL
      const urlParams = new URLSearchParams(window.location.search);
      const referredBy = urlParams.get('ref') || null;
      
      // Generate referral code (6 chars, no confusing characters)
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let refCode = '';
      for (let i = 0; i < 6; i++) {
        refCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      // Insert into Supabase
      const { data, error } = await sb
        .from('signups')
        .insert([
          {
            email: email,
            ref_code: refCode,
            referred_by: referredBy
          }
        ])
        .select();
      
      if (error) {
        // Handle duplicate email
        if (error.code === '23505') {
          errorMessage.textContent = "You're already on the list! Check your email or refresh to see your spot.";
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage.textContent = "Couldn't reach our servers. Try again in a sec.";
        } else {
          errorMessage.textContent = "Something went wrong. Try again or DM us on X.";
        }
        errorMessage.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get on the list';
        return;
      }
      
      // If referred by someone, increment their referral count
      if (referredBy) {
        await sb.rpc('increment_referral', { ref: referredBy });
      }
      
      // Redirect to thanks page
      window.location.href = `thanks.html?ref=${refCode}`;
      
    } catch (err) {
      console.error('Error:', err);
      errorMessage.textContent = "Something went wrong. Try again or DM us on X.";
      errorMessage.classList.remove('hidden');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Get on the list';
    }
  });
});