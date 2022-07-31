
export function ScrollableDisplay(_scrollableDisplay) {
  const scrollableDisplay = _scrollableDisplay;
  let overflowed = false;

  this.addEntry = (input, result) => {
    this.appendToScrollableDisplay(this.createEntry(input, result));
  };

  this.clear = () => {
    scrollableDisplay.innerHTML = '';
  };

  this.createEntry = (input, result) => {
    const entry = document.createElement('div');
    entry.classList.add('display');
  
    const previousInput = document.createElement('input');
    previousInput.type = 'text';
    previousInput.value = input;
    previousInput.readOnly = true;
  
    const right = document.createElement('div');
    right.classList.add('result');
    right.textContent = result;
    
    entry.appendChild(previousInput);
    entry.appendChild(right);
  
    return entry;
  };

  this.appendToScrollableDisplay = (entry) => {
    scrollableDisplay.insertBefore(entry, scrollableDisplay.firstChild);
  
    if (!overflowed && isOverflowed(scrollableDisplay)) {
      scrollableDisplay.lastElementChild.style.borderTopColor = 'transparent';
      overflowed = true;
    }
  
    scrollableDisplay.scrollTop = scrollableDisplay.scrollHeight;
  };

  function isOverflowed({ clientWidth, clientHeight, scrollWidth, scrollHeight }) {
    return scrollHeight > clientHeight || scrollWidth > clientWidth;
  }
}
