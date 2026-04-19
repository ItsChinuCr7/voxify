<script>
  let selectedRating = 0;

  function openFeedback() {
    document.getElementById("feedbackOverlay").style.display = "flex";
  }

  function closeFeedback() {
    document.getElementById("feedbackOverlay").style.display = "none";
  }

  function setRating(rating) {
    selectedRating = rating;
    const stars = document.querySelectorAll(".stars span");
    stars.forEach((star, index) => {
      star.classList.toggle("active", index < rating);
    });
  }

  function submitFeedback() {
    if (selectedRating === 0) {
      alert("Please rate your experience");
      return;
    }

    alert("Thank you for your feedback!");
    closeFeedback();
  }
</script>