// JavaScript to clone and append list items
document.addEventListener('DOMContentLoaded', function () {
  const listContainer = document.getElementById('listContainer');

  // Set the number of items you want to show
  const itemsToShow = 5;

  // Add scroll event listener
  window.addEventListener('scroll', function () {
    const rect = listContainer.getBoundingClientRect();
    if (rect.bottom <= window.innerHeight && itemsToShow > 0) {
      // Append a cloned list item when the container is about to go out of view
      const listItemClone = listContainer.firstElementChild.cloneNode(true);
      listContainer.appendChild(listItemClone);
      itemsToShow--;
    }
  });
});
