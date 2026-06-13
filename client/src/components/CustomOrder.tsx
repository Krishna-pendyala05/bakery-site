import React, { useState, useEffect, useRef } from 'react';

export const CustomOrder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [occasion, setOccasion] = useState('Birthday');
  const [size, setSize] = useState('1kg');
  const [flavor, setFlavor] = useState('Pineapple Fresh Cream');
  const [isEggless, setIsEggless] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showFlavorPicker, setShowFlavorPicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [phoneInvalid, setPhoneInvalid] = useState(false);
  const [descInvalid, setDescInvalid] = useState(false);
  const [dateInvalid, setDateInvalid] = useState(false);
  const [timeInvalid, setTimeInvalid] = useState(false);
  const [nameInvalid, setNameInvalid] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);

  const coContainerRef = useRef<HTMLDivElement>(null);
  const coSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = coContainerRef.current;
    const section = coSectionRef.current;
    if (!container || !section) return;

    let targetProgress = 0;
    let currentProgress = 0;
    let isAnimating = false;

    const updatePhysics = () => {
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) < 0.0001) {
        currentProgress = targetProgress;
        isAnimating = false;
      } else {
        currentProgress += diff * 0.085;
        isAnimating = true;
      }

      const wobble = Math.sin(currentProgress * Math.PI * 3.5) * 12 * (1 - currentProgress);

      section.style.setProperty('--unzip-progress', currentProgress.toString());
      section.style.setProperty('--heart-wobble', `${wobble}deg`);

      if (isAnimating) {
        requestAnimationFrame(updatePhysics);
      }
    };

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const containerHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const scrollRange = containerHeight - viewportHeight;

      const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 70;
      const startY = rect.top - navHeight;
      const scrollOffset = -startY;

      // Define a dead zone in pixels (e.g. 200px) where the form stays completely closed
      const deadZone = 200;

      let progress = 0;
      if (scrollOffset > deadZone) {
        progress = Math.min((scrollOffset - deadZone) / (scrollRange - deadZone), 1);
      }

      // Check if an input, textarea, or button inside the form is focused
      const activeEl = document.activeElement;
      const isFocused = activeEl && section.contains(activeEl) &&
                       (activeEl.tagName === 'INPUT' || 
                        activeEl.tagName === 'TEXTAREA' || 
                        activeEl.tagName === 'BUTTON');

      // If they are focused and scroll past the deadZone, auto-blur the input so the unzip animation can reveal "Our Story"
      if (isFocused && scrollOffset > deadZone) {
        (activeEl as HTMLElement).blur();
      }

      targetProgress = progress;

      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(updatePhysics);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.co-picker-container')) {
        setShowDatePicker(false);
        setShowTimePicker(false);
        setShowFlavorPicker(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const getDaysInMonth = (dateVal: Date) => {
    const year = dateVal.getFullYear();
    const month = dateVal.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysCount = new Date(year, month + 1, 0).getDate();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    
    const days = [];
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysCount; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  const formatISO = (d: Date) => {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const formatDisplayTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH}:${minutes} ${ampm}`;
  };

  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  };

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  };

  const timeSlots: { value: string; label: string }[] = [];
  for (let hour = 10; hour <= 20; hour++) {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    timeSlots.push({ value: `${hour.toString().padStart(2, '0')}:00`, label: `${displayHour}:00 ${period}` });
    if (hour !== 20) {
      timeSlots.push({ value: `${hour.toString().padStart(2, '0')}:30`, label: `${displayHour}:30 ${period}` });
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setDescInvalid(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    // Step 1 Validation: Must provide either Description OR Inspiration Image
    const hasDescription = description.trim().length > 0;
    const hasImage = imagePreview !== null;

    if (!hasDescription && !hasImage) {
      setDescInvalid(true);
      return;
    }

    setDescInvalid(false);
    setCurrentStep(2);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!date) {
      setDateInvalid(true);
      hasError = true;
    } else {
      setDateInvalid(false);
    }

    if (!time) {
      setTimeInvalid(true);
      hasError = true;
    } else {
      setTimeInvalid(false);
    }

    if (!name.trim()) {
      setNameInvalid(true);
      hasError = true;
    } else {
      setNameInvalid(false);
    }

    if (phone.length !== 10) {
      setPhoneInvalid(true);
      hasError = true;
    } else {
      setPhoneInvalid(false);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setEmailInvalid(true);
      hasError = true;
    } else {
      setEmailInvalid(false);
    }

    if (hasError) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const resetForm = () => {
    setOccasion('Birthday');
    setSize('1kg');
    setFlavor('Pineapple Fresh Cream');
    setIsEggless(false);
    setDate('');
    setTime('');
    setImagePreview(null);
    setDescription('');
    setNotes('');
    setName('');
    setPhone('');
    setEmail('');
    setCurrentStep(1);
    setIsSuccess(false);
    setShowDatePicker(false);
    setShowTimePicker(false);
    setPhoneInvalid(false);
    setDescInvalid(false);
    setDateInvalid(false);
    setTimeInvalid(false);
    setNameInvalid(false);
    setEmailInvalid(false);
  };

  return (
    <div ref={coContainerRef} id="custom-order-container" className="co-scroll-container">
      <section id="custom-order-section" className="co-section" ref={coSectionRef}>
        <style>{`
        /* ── Scroll Pinned Container ───────────────────────── */
        .co-scroll-container {
          position: relative;
          height: 230vh;
          background: var(--color-bg);
        }

        /* ── Wrapper: same as .hero-section ───────────────────── */
        .co-section {
          position: sticky;
          top: var(--nav-height);
          display: flex;
          flex-direction: row;
          gap: 10px;
          background: var(--color-bg);
          width: 100%;
          height: calc(100vh - var(--nav-height));
          min-height: 560px;
          overflow: hidden;
          border-top: 10px solid var(--color-bg);
          border-bottom: 10px solid var(--color-bg);
          
          /* Unzip variables */
          --unzip-progress: 0;
          --heart-wobble: 0deg;
        }

        /* ── REVEAL BACKGROUND (Our Story) ───────────────────── */
        .co-unzip-reveal-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle, #FFF8FA 0%, #FFFFFF 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 0;
          pointer-events: none;
        }
        .co-story-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 700px;
          padding: 40px;
          text-align: center;
          box-sizing: border-box;
          opacity: var(--unzip-progress);
          transform: translateY(calc(60px - var(--unzip-progress) * 60px)) scale(calc(0.92 + 0.08 * var(--unzip-progress)));
          transition: opacity 50ms linear, transform 50ms linear;
        }
        .co-story-title {
          font-family: var(--font-logo);
          font-size: clamp(32px, 5vw, 64px);
          color: #7A5145;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0 0 16px 0;
        }
        .co-story-divider {
          width: 80px;
          height: 3px;
          background: #7A5145;
          margin-bottom: 24px;
          border-radius: 9999px;
        }
        .co-story-paragraph {
          font-family: var(--font-upright);
          font-size: clamp(16px, 2.2vw, 24px);
          font-style: italic;
          line-height: 1.5;
          color: #7A5145;
          margin: 0 0 18px 0;
        }
        .co-story-paragraph:last-child {
          margin-bottom: 0;
        }

        /* ── LEFT panel: same as .hero-left ───────────────────── */
        .co-left {
          position: relative;
          flex: 0 0 calc(50% - 5px);
          min-width: 0;
          height: 100%;
          background: #7A5145;
          overflow: hidden;
          isolation: isolate;
          z-index: 2;
          
          /* Morph right edge into a vertical capsule as it slides away */
          border-radius: 0 calc(50px + 300px * var(--unzip-progress)) calc(50px + 300px * var(--unzip-progress)) 0;
          
          /* Slide out to the left */
          transform: translateX(calc(-50vw * var(--unzip-progress)));
          transition: border-radius 50ms linear, transform 50ms linear;
          
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Quote block: same as .hero-quote ────────────────── */
        .co-quote {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(calc(1 - 0.1 * var(--unzip-progress)));
          width: 85%;
          max-width: 500px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 50ms linear;
        }

        .co-quote-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.15em;
        }

        .co-line {
          position: relative;
          display: block;
          width: fit-content;
          white-space: nowrap;
        }

        .co-line span {
          font-family: var(--font-logo);
          font-size: clamp(40px, 6vw, 80px);
          font-weight: 400;
          text-transform: uppercase;
          color: var(--color-bg);
          -webkit-text-stroke: 1.5px var(--color-ink);
          text-shadow: 3px 3px 0 var(--color-ink);
          line-height: 0.95;
          letter-spacing: 0.02em;
          display: block;
        }

        .co-quote-open {
          position: absolute;
          right: 100%;
          bottom: calc(100% - 0.22em);
          margin-right: 10px;
          width: clamp(28px, 3.5vw, 52px);
          height: auto;
          display: block;
        }

        .co-quote-close {
          position: absolute;
          left: 100%;
          top: calc(100% - 0.22em);
          margin-left: 10px;
          width: clamp(28px, 3.5vw, 52px);
          height: auto;
          display: block;
        }

        /* ── Heart: same as .hero-heart ──────────────────────── */
        .co-heart {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(var(--heart-wobble)) scale(calc(1 - 0.6 * var(--unzip-progress)));
          opacity: calc(1 - var(--unzip-progress) * 2.5);
          width: clamp(70px, 7.5vw, 105px);
          height: auto;
          z-index: 10;
          pointer-events: none;
          filter: drop-shadow(0px 6px 12px rgba(0,0,0,0.2));
          transition: transform 50ms linear, opacity 50ms linear;
        }

        /* Fade panel contents early in the slide to prevent clipping overflow */
        .co-quote,
        .co-right > *:not(style) {
          opacity: calc(1 - var(--unzip-progress) * 2.5);
          transition: opacity 50ms linear;
        }

        /* ── RIGHT panel: same as .hero-right ────────────────── */
        .co-right {
          position: relative;
          flex: 0 0 calc(50% - 5px);
          min-width: 0;
          height: 100%;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          padding: 40px 52px;
          z-index: 2;
          
          /* Morph left edge into a vertical capsule as it slides away */
          border-radius: calc(50px + 300px * var(--unzip-progress)) 0 0 calc(50px + 300px * var(--unzip-progress));
          
          /* Slide out to the right */
          transform: translateX(calc(50vw * var(--unzip-progress)));
          transition: border-radius 50ms linear, transform 50ms linear;
          
          box-sizing: border-box;
          border-top: 2px solid var(--color-ink);
          border-bottom: 2px solid var(--color-ink);
          border-left: 2px solid var(--color-ink);
        }

        /* ── Mobile layout ───────────────────────────────────── */
        @media (max-width: 700px) {
          .co-scroll-container { height: auto; }
          .co-section { position: relative; top: 0; flex-direction: column; height: auto; }
          .co-left {
            width: 100%; height: 50vw; min-height: 300px;
            border-radius: 0 50px 50px 0;
            transform: none !important;
          }
          .co-right {
            width: 100%; height: auto; min-height: 500px;
            border-radius: 50px 0 0 50px;
            padding: 32px 20px;
            border-left: none;
            border-top: 2px solid var(--color-ink);
            transform: none !important;
          }
          .co-heart { top: 50%; left: 50%; transform: translate(-50%, -50%) !important; }
        }idth: 100%; height: auto; min-height: 500px;
            border-radius: 50px 0 0 50px;
            padding: 32px 20px;
            border-left: none;
            border-top: 2px solid var(--color-ink);
          }
          .co-heart { top: 50%; left: 50%; transform: translate(-50%, -50%); }
        }

        /* ── Pulsing Alert Banner ────────────────────────────── */
        .co-alert-banner {
          background: #FFF0F0;
          border: 2px solid #D32F2F;
          color: #D32F2F;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-family: sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: co-blink-shadow 1.5s infinite ease-in-out;
        }

        @keyframes co-blink-shadow {
          0%, 100% {
            border-color: #D32F2F;
            box-shadow: 0 0 0px rgba(211, 47, 47, 0);
          }
          50% {
            border-color: rgba(211, 47, 47, 0.4);
            box-shadow: 0 0 12px rgba(211, 47, 47, 0.25);
          }
        }

        /* ── Step progress (2 Steps) ─────────────────────────── */
        .co-steps {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
          position: relative;
          padding: 0 8px;
        }
        .co-steps-line-bg {
          position: absolute;
          top: 50%; left: 8px; right: 8px;
          height: 2px;
          background: rgba(26,26,26,0.1);
          transform: translateY(-50%);
          z-index: 0;
        }
        .co-steps-line-fill {
          position: absolute;
          top: 50%; left: 8px;
          height: 2px;
          background: #7A5145;
          transform: translateY(-50%);
          z-index: 1;
          transition: width 0.45s cubic-bezier(0.25,1,0.5,1);
        }
        .co-step-node {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 2px solid rgba(26,26,26,0.2);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-logo);
          font-size: 1rem;
          color: rgba(26,26,26,0.45);
          z-index: 2;
          transition: all 0.3s ease;
        }
        .co-step-node + .co-step-node { margin-left: auto; }
        .co-step-node.active {
          background: #7A5145; border-color: #7A5145; color: #fff;
          box-shadow: 0 0 0 5px rgba(122,81,69,0.15);
        }
        .co-step-node.done {
          background: #fff; border-color: #7A5145; color: #7A5145;
        }

        /* ── Slider (2 steps = 200%) ────────────────────────── */
        .co-slider-wrap { flex: 1; overflow: hidden; display: flex; flex-direction: column; }
        .co-slider {
          display: flex;
          width: 200%;
          height: 100%;
          transition: transform 0.5s cubic-bezier(0.25,1,0.5,1);
        }
        .co-pane {
          width: 50%;
          height: 100%;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          padding: 4px 8px 4px 4px;
          overflow-y: auto;
        }
        .co-pane-step1 {
          gap: 20px;
        }
        .co-pane-step2 {
          gap: 34px;
        }
        .co-pane::-webkit-scrollbar {
          width: 6px;
        }
        .co-pane::-webkit-scrollbar-track {
          background: transparent;
        }
        .co-pane::-webkit-scrollbar-thumb {
          background: rgba(122, 81, 69, 0.2);
          border-radius: 9999px;
        }
        .co-pane::-webkit-scrollbar-thumb:hover {
          background: rgba(122, 81, 69, 0.4);
        }

        /* ── Form components ─────────────────────────────────── */
        .co-label {
          font-family: var(--font-logo);
          font-size: 1.15rem;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: var(--color-ink);
          display: block;
          margin-bottom: 8px;
        }
        .co-label .req {
          color: #7A5145;
          margin-left: 4px;
          font-family: var(--font-upright);
          font-weight: 600;
          font-size: 1.25rem;
          vertical-align: middle;
          display: inline-block;
          line-height: 0;
          position: relative;
          top: -2px;
        }

        .co-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .co-pill {
          font-family: var(--font-logo);
          font-size: 1.05rem;
          padding: 8px 20px;
          border-radius: 9999px;
          border: 2px solid var(--color-ink);
          background: #fff; color: var(--color-ink);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .co-pill:hover { transform: translateY(-1px); }
        .co-pill.on {
          background: #7A5145; color: #fff; border-color: #7A5145;
          box-shadow: 3px 3px 0 var(--color-ink);
        }

        /* Size & Eggless layout row */
        .co-size-eggless-row {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 16px;
        }

        /* Compact eggless selector */
        .co-eggless-compact {
          display: flex;
          flex-direction: column;
        }
        .co-switch { position: relative; width: 54px; height: 28px; display: inline-block; }
        .co-switch input { opacity: 0; width: 0; height: 0; }
        .co-switch-track {
          position: absolute; inset: 0;
          background: #FFFFFF;
          border: 2px solid var(--color-ink);
          border-radius: 34px; cursor: pointer;
          transition: 0.3s ease;
        }
        .co-switch-track::before {
          content: ""; position: absolute;
          width: 18px; height: 18px;
          left: 3px; bottom: 3px;
          background: var(--color-ink);
          border-radius: 50%;
          transition: 0.3s ease;
        }
        .co-switch input:checked + .co-switch-track { background: #7A5145; border-color: var(--color-ink); }
        .co-switch input:checked + .co-switch-track::before { transform: translateX(26px); background: #FFFFFF; }

        /* Flavour Picker Styles */
        .co-flavor-popover {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #FFFFFF;
          border: 2px solid var(--color-ink);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 100;
          margin-top: 4px;
          max-height: 200px;
          overflow-y: auto;
        }
        .co-flavor-list {
          display: flex;
          flex-direction: column;
          padding: 6px;
        }
        .co-flavor-option {
          padding: 10px 14px;
          font-family: var(--font-logo);
          font-size: 1.1rem;
          text-align: left;
          text-transform: uppercase;
          color: var(--color-ink);
          border-radius: 6px;
          transition: all 0.2s ease;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
        }
        .co-flavor-option:hover {
          background: #FAF9F5;
          color: #7A5145;
        }
        .co-flavor-option.selected {
          background: #7A5145;
          color: #ffffff;
        }
        .co-flavor-popover::-webkit-scrollbar {
          width: 6px;
        }
        .co-flavor-popover::-webkit-scrollbar-track {
          background: transparent;
        }
        .co-flavor-popover::-webkit-scrollbar-thumb {
          background: rgba(122, 81, 69, 0.2);
          border-radius: 9999px;
        }
        .co-flavor-popover::-webkit-scrollbar-thumb:hover {
          background: rgba(122, 81, 69, 0.4);
        }

        /* Description & Reference layout grid */
        .co-design-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 16px;
          margin-bottom: 4px;
        }
        @media (max-width: 600px) {
          .co-design-grid { grid-template-columns: 1fr; }
        }

        .co-input {
          font-family: var(--font-logo);
          font-size: 1.05rem;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          padding: 12px 14px;
          border: 2px solid var(--color-ink);
          border-radius: 12px;
          background: #FFFFFF;
          color: var(--color-ink);
          width: 100%;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .co-input::placeholder {
          color: rgba(26, 26, 26, 0.45);
          font-family: var(--font-logo);
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .co-input:focus {
          outline: none;
          box-shadow: 3px 3px 0 var(--color-ink);
          transform: translate(-1px, -1px);
        }
        #co-email {
          font-family: sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          text-transform: none;
          letter-spacing: normal;
        }
        #co-email::placeholder {
          font-family: sans-serif;
          font-size: 0.95rem;
          text-transform: none;
          letter-spacing: normal;
        }

        .co-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

        /* Upload block */
        .co-upload {
          border: 2px dashed var(--color-ink);
          border-radius: 12px;
          height: 96px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          background: #FFFFFF;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .co-upload:hover { background: rgba(26, 26, 26, 0.03); }
        .co-upload-icon { font-size: 1.6rem; display: block; margin-bottom: 2px; }
        .co-upload-title {
          font-family: var(--font-logo);
          font-size: 0.95rem;
          text-transform: uppercase;
          color: #7A5145;
        }
        .co-upload-sub {
          font-family: var(--font-logo);
          font-size: 0.85rem;
          color: var(--color-ink-muted);
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin-top: 2px;
        }

        .co-preview {
          position: relative;
          height: 96px;
          border-radius: 12px;
          overflow: hidden;
          border: 2px solid var(--color-ink);
          box-sizing: border-box;
        }
        .co-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          background: #FFFFFF;
        }
        .co-preview-rm {
          position: absolute; top: 4px; right: 4px;
          background: #c0392b; color: #fff;
          border: none; border-radius: 50%;
          width: 20px; height: 20px;
          font-size: 0.75rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
        }

        .co-hint-text {
          font-family: var(--font-logo);
          font-size: 0.95rem;
          color: var(--color-ink-muted);
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin-top: -6px;
        }

        /* ── Nav footer buttons (Matches Hero CTA style) ──────── */
        .co-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 16px;
        }

        .co-btn {
          font-family: var(--font-logo);
          font-size: 1.15rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border: 2px solid var(--color-ink);
          padding: 10px 24px;
          cursor: pointer;
          white-space: nowrap;
          transition: background var(--transition-fast), color var(--transition-fast), transform 0.15s, box-shadow 0.15s;
          box-shadow: 3px 3px 0 var(--color-ink);
        }
        .co-btn:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 var(--color-ink); }

        .co-btn-back {
          background: #FFFFFF; color: var(--color-ink);
          border-radius: 25px 0 25px 0;
        }
        .co-btn-back:hover { background: var(--color-ink); color: #FFFFFF; }

        .co-btn-next {
          background: var(--color-ink); color: var(--color-bg);
          border-radius: 0 25px 0 25px;
          margin-left: auto;
        }
        .co-btn-next:hover { background: #7A5145; color: #FFFFFF; }

        .co-btn-submit {
          background: #7A5145; color: #FFFFFF;
          border-radius: 0 25px 0 25px;
          margin-left: auto;
          display: flex; align-items: center; gap: 8px;
        }
        .co-btn-submit:hover { background: #9a6659; }
        .co-btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        .co-spinner {
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          width: 14px; height: 14px;
          animation: co-spin 0.9s linear infinite;
        }
        @keyframes co-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* ── Success State ───────────────────────────────────── */
        .co-success {
          flex: 1;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
          animation: co-fadein 0.5s ease;
        }
        .co-success-icon { font-size: 3.5rem; margin-bottom: 12px; animation: co-beat 1s ease infinite alternate; }
        .co-success-h { font-family: var(--font-logo); font-size: 2rem; text-transform: uppercase; color: #7A5145; margin: 0 0 12px; }
        .co-success-p { font-family: var(--font-upright); font-size: 1.2rem; line-height: 1.55; color: var(--color-ink); margin: 0 0 24px; max-width: 380px; }

        /* ── Custom Popover Date & Time Pickers ────────────────── */
        .co-picker-container {
          position: relative;
        }
        .co-picker-trigger {
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
        }
        .co-calendar-popover, .co-time-popover {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          z-index: 100;
          background: #FFFFFF;
          border: 2px solid var(--color-ink);
          border-radius: 16px;
          box-shadow: 4px 4px 0 var(--color-ink);
          box-sizing: border-box;
          padding: 16px;
          width: 280px;
          animation: co-fadein 0.25s ease-out;
        }
        .co-calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .co-calendar-header span {
          font-family: var(--font-logo);
          font-size: 1.1rem;
          text-transform: uppercase;
          color: var(--color-ink);
        }
        .co-calendar-header button {
          background: none;
          border: none;
          color: var(--color-ink);
          font-size: 1.2rem;
          font-weight: bold;
          cursor: pointer;
          padding: 4px 8px;
          transition: transform 0.15s;
        }
        .co-calendar-header button:hover {
          transform: scale(1.2);
        }
        .co-calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 8px;
        }
        .co-calendar-weekdays span {
          font-family: var(--font-logo);
          font-size: 0.85rem;
          color: var(--color-ink-muted);
        }
        .co-calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .co-calendar-empty {
          height: 32px;
        }
        .co-calendar-day {
          height: 32px;
          width: 32px;
          border: none;
          border-radius: 50%;
          background: none;
          font-family: var(--font-logo);
          font-size: 0.95rem;
          color: var(--color-ink);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .co-calendar-day:hover:not(:disabled) {
          background: rgba(122, 81, 69, 0.15);
        }
        .co-calendar-day.today {
          border: 2px solid var(--color-ink);
        }
        .co-calendar-day.selected {
          background: #7A5145 !important;
          color: #FFFFFF !important;
          box-shadow: 2px 2px 0 var(--color-ink);
        }
        .co-calendar-day:disabled {
          color: rgba(26, 26, 26, 0.25);
          cursor: not-allowed;
          text-decoration: line-through;
        }
        .co-time-popover {
          width: 220px;
          padding: 8px;
        }
        .co-time-list {
          max-height: 200px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .co-time-list::-webkit-scrollbar {
          width: 6px;
        }
        .co-time-list::-webkit-scrollbar-track {
          background: rgba(26,26,26,0.05);
          border-radius: 3px;
        }
        .co-time-list::-webkit-scrollbar-thumb {
          background: var(--color-ink-muted);
          border-radius: 3px;
        }
        .co-time-option {
          background: none;
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          font-family: var(--font-logo);
          font-size: 1rem;
          text-align: left;
          color: var(--color-ink);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .co-time-option:hover {
          background: rgba(122, 81, 69, 0.1);
        }
        .co-time-option.selected {
          background: #7A5145;
          color: #FFFFFF;
        }

        /* ── Phone Input Prefix and Error ────────────────────── */
        .co-phone-input-wrap {
          display: flex;
          align-items: center;
          border: 2px solid var(--color-ink);
          border-radius: 12px;
          background: #FFFFFF;
          box-sizing: border-box;
          transition: all 0.2s ease;
          width: 100%;
          overflow: hidden;
        }
        .co-phone-input-wrap:focus-within {
          box-shadow: 3px 3px 0 var(--color-ink);
          transform: translate(-1px, -1px);
        }
        .co-phone-prefix {
          font-family: var(--font-logo);
          font-size: 1.05rem;
          color: #7A5145;
          padding-left: 14px;
          user-select: none;
          letter-spacing: 0.02em;
        }
        .co-phone-input-wrap .co-input {
          border: none !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          transform: none !important;
          padding-left: 8px !important;
          background: transparent !important;
          flex: 1;
          min-width: 0;
          width: auto !important;
        }
        .co-input.invalid,
        .co-upload.invalid,
        .co-phone-input-wrap.invalid {
          border-color: #D32F2F !important;
          animation: co-blink-border 0.5s ease-in-out infinite alternate;
        }
        @keyframes co-blink-border {
          0% { border-color: #D32F2F; box-shadow: 0 0 8px rgba(211, 47, 47, 0.6); }
          100% { border-color: rgba(211, 47, 47, 0.2); box-shadow: 0 0 0px transparent; }
        }
        .co-phone-error-text {
          font-family: var(--font-logo);
          color: #D32F2F;
          font-size: 0.85rem;
          margin-top: 4px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
      `}</style>

      {/* ── REVEAL BACKGROUND (Our Story) ───────────────────── */}
      <div className="co-unzip-reveal-bg">
        <div className="co-story-wrap">
          <h3 className="co-story-title">Our Story</h3>
          <div className="co-story-divider" />
          <p className="co-story-paragraph">
            For the past ten years, we have been your neighborhood bakery, crafting moments of warmth and delight. What started as a humble kitchen fueled by passion has grown into a local cornerstone, dedicated to sharing love, celebration, and happiness.
          </p>
          <p className="co-story-paragraph">
            We believe in honest, diligent work. Every ingredient is chosen with care, every recipe perfected by hand. We may be a small bakery, but our heart is infinite, and we strive to give our very best to you, our family, every single day.
          </p>
        </div>
      </div>

      {/* ── LEFT panel (mirrors .hero-left) ───────────────────── */}
      <div className="co-left">
        <div className="co-quote">
          <div className="co-quote-content">
            <div className="co-line">
              <img src="/quote 1st.png" alt="" aria-hidden="true" className="co-quote-open" />
              <span>Have</span>
            </div>
            <div className="co-line"><span>Something</span></div>
            <div className="co-line"><span>Special In</span></div>
            <div className="co-line">
              <span>Mind?</span>
              <img src="/quote 2nd.png" alt="" aria-hidden="true" className="co-quote-close" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Heart Divider — position:absolute on .co-section, same as .hero-heart ── */}
      <img src="/brown heart.png" alt="" aria-hidden="true" className="co-heart" />

      {/* ── RIGHT panel (mirrors .hero-right) ─────────────────── */}
      <div className="co-right">

        {isSuccess ? (
          <div className="co-success">
            <svg className="co-success-icon" width="48" height="48" viewBox="0 0 24 24" fill="#7A5145" stroke="#7A5145" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'co-beat 1s ease infinite alternate', marginBottom: '12px' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h3 className="co-success-h">Request Received!</h3>
            <p className="co-success-p">
              Thank you, <strong>{name}</strong>! We've received your request for a custom{' '}
              <strong>{size} {flavor} {occasion} cake</strong>. Our bakers will call you within 2 hours to confirm your design!
            </p>
            <button onClick={resetForm} className="co-btn co-btn-back">Request Another</button>
          </div>
        ) : (
          <>


            {/* Step progress */}
            <div className="co-steps">
              <div className="co-steps-line-bg" />
              <div className="co-steps-line-fill" style={{ width: `${(currentStep - 1) * 100}%` }} />
              {[1, 2].map(n => (
                <div key={n} className={`co-step-node ${currentStep === n ? 'active' : currentStep > n ? 'done' : ''}`}>
                  {currentStep > n ? '✓' : n}
                </div>
              ))}
            </div>

            {/* Slider */}
            <div className="co-slider-wrap">
              <div className="co-slider" style={{ transform: `translateX(-${(currentStep - 1) * 50}%)` }}>

                {/* STEP 1: Cake Details */}
                <div className="co-pane co-pane-step1">
                  {/* Occasion Selection */}
                  <div>
                    <span className="co-label">What is the Occasion?</span>
                    <div className="co-pills">
                      {['Birthday', 'Anniversary', 'Wedding', 'Festive', 'Other'].map(o => (
                        <button
                          key={o}
                          type="button"
                          className={`co-pill ${occasion === o ? 'on' : ''}`}
                          onClick={() => {
                            setOccasion(o);
                            setValidationError(null);
                          }}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size & Eggless Choice Row */}
                  <div className="co-size-eggless-row">
                    <div>
                      <span className="co-label">Cake Size</span>
                      <div className="co-pills">
                        {['500g', '1kg', '2kg'].map(s => (
                          <button
                            key={s}
                            type="button"
                            className={`co-pill ${size === s ? 'on' : ''}`}
                            onClick={() => {
                              setSize(s);
                              setValidationError(null);
                            }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="co-eggless-compact">
                      <span className="co-label">Eggless?</span>
                      <div style={{ display: 'flex', alignItems: 'center', height: '38px', gap: '10px' }}>
                        <label className="co-switch" htmlFor="co-eggless-toggle">
                          <input
                            id="co-eggless-toggle"
                            type="checkbox"
                            checked={isEggless}
                            onChange={e => {
                              setIsEggless(e.target.checked);
                              setValidationError(null);
                            }}
                          />
                          <span className="co-switch-track" />
                        </label>
                        <span style={{
                          fontFamily: 'var(--font-logo)',
                          fontSize: '1.25rem',
                          color: isEggless ? '#7A5145' : 'var(--color-ink)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em',
                          userSelect: 'none',
                          transition: 'color 0.2s ease'
                        }}>
                          {isEggless ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Signature Flavour Selection */}
                  <div>
                    <span className="co-label">Choose Flavour <span className="req">*</span></span>
                    <div className="co-picker-container" style={{ position: 'relative' }}>
                      <button
                        type="button"
                        className="co-input co-picker-trigger"
                        onClick={() => {
                          setShowFlavorPicker(!showFlavorPicker);
                        }}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{
                          color: flavor ? 'var(--color-ink)' : 'rgba(26,26,26,0.45)',
                          fontFamily: 'var(--font-logo)',
                          fontSize: '1.1rem',
                          textTransform: 'uppercase'
                        }}>
                          {flavor || 'SELECT FLAVOUR'}
                        </span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', color: 'var(--color-ink)', transform: showFlavorPicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}>
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      {showFlavorPicker && (
                        <div className="co-flavor-popover">
                          <div className="co-flavor-list">
                            {[
                              'Pineapple Fresh Cream',
                              'Classic Red Velvet',
                              'Wild Blueberry Custard',
                              'Black Forest Gateau',
                              'Classic Chocolate Fudge',
                              'Lavender Blueberry',
                              'Double Choco Chip',
                              'Kaju Katli Celebration',
                              'Rasmalai Cardamom'
                            ].map(f => {
                              const isSelected = flavor === f;
                              return (
                                <button
                                  key={f}
                                  type="button"
                                  className={`co-flavor-option ${isSelected ? 'selected' : ''}`}
                                  onClick={() => {
                                    setFlavor(f);
                                    setShowFlavorPicker(false);
                                    setValidationError(null);
                                  }}
                                >
                                  {f}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Design Description & Upload Side-by-Side */}
                  <div>
                    <span className="co-label">Design Reference <span className="req">*</span></span>
                    <span className="co-hint-text" style={{ display: 'block', marginBottom: '10px', marginTop: '4px' }}>
                      Please provide either a written description or upload an image so our bakers have a reference.
                    </span>
                    <div className="co-design-grid">
                      {/* Left: Description */}
                      <div>
                        <textarea
                          id="co-desc-textarea"
                          className={`co-input ${descInvalid ? 'invalid' : ''}`}
                          rows={4}
                          style={{ resize: 'none', height: '96px' }}
                          placeholder="Describe your design (colors, text, patterns...)"
                          value={description}
                          onChange={e => {
                            setDescription(e.target.value);
                            if (e.target.value.trim().length > 0) {
                              setDescInvalid(false);
                            }
                          }}
                        />
                      </div>

                      {/* Right: Upload Inspiration */}
                      <div>
                        {imagePreview ? (
                          <div className="co-preview">
                            <img src={imagePreview} alt="Preview" />
                            <button
                              type="button"
                              className="co-preview-rm"
                              onClick={() => {
                                setImagePreview(null);
                                setValidationError(null);
                              }}
                              aria-label="Remove uploaded preview"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <label className={`co-upload ${descInvalid ? 'invalid' : ''}`} htmlFor="co-file-input">
                            <input
                              id="co-file-input"
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={handleImageChange}
                            />
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7A5145" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '4px' }}>
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                              <circle cx="12" cy="13" r="4" />
                            </svg>
                            <span className="co-upload-title">Reference Image</span>
                            <span className="co-upload-sub">JPEG or PNG</span>
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

                {/* STEP 2: Delivery & Contact details */}
                <div className="co-pane co-pane-step2">
                  {/* Date & Time */}
                  <div className="co-row">
                    <div>
                      <span className="co-label">Pickup Date <span className="req">*</span></span>
                      <div className="co-picker-container">
                        <button
                          type="button"
                          id="co-date-trigger"
                          className={`co-input co-picker-trigger ${dateInvalid ? 'invalid' : ''}`}
                          onClick={() => {
                            setShowDatePicker(!showDatePicker);
                            setShowTimePicker(false);
                          }}
                        >
                          <span style={{
                            color: date ? 'var(--color-ink)' : 'rgba(26,26,26,0.45)',
                            fontFamily: 'var(--font-logo)',
                            fontSize: '1.1rem',
                            textTransform: 'uppercase'
                          }}>
                            {date ? formatDisplayDate(date) : 'SELECT DATE'}
                          </span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', color: 'var(--color-ink)' }}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </button>

                        {showDatePicker && (
                          <div className="co-calendar-popover">
                            <div className="co-calendar-header">
                              <button type="button" onClick={prevMonth}>&larr;</button>
                              <span>{calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                              <button type="button" onClick={nextMonth}>&rarr;</button>
                            </div>
                            <div className="co-calendar-weekdays">
                              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((dayName, idx) => (
                                <span key={idx}>{dayName}</span>
                              ))}
                            </div>
                            <div className="co-calendar-grid">
                              {getDaysInMonth(calendarMonth).map((dayVal, idx) => {
                                if (!dayVal) return <span key={idx} className="co-calendar-empty" />;
                                const isToday = dayVal.toDateString() === new Date().toDateString();
                                const isSelected = date === formatISO(dayVal);
                                
                                const dMidnight = new Date(dayVal.getTime());
                                dMidnight.setHours(0,0,0,0);
                                const isPast = dMidnight.getTime() < new Date().setHours(0,0,0,0);
                                
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    disabled={isPast}
                                    className={`co-calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                                    onClick={() => {
                                      setDate(formatISO(dayVal));
                                      setShowDatePicker(false);
                                      setDateInvalid(false);
                                    }}
                                  >
                                    {dayVal.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="co-label">Pickup Time <span className="req">*</span></span>
                      <div className="co-picker-container">
                        <button
                          type="button"
                          id="co-time-trigger"
                          className={`co-input co-picker-trigger ${timeInvalid ? 'invalid' : ''}`}
                          onClick={() => {
                            setShowTimePicker(!showTimePicker);
                            setShowDatePicker(false);
                          }}
                        >
                          <span style={{
                            color: time ? 'var(--color-ink)' : 'rgba(26,26,26,0.45)',
                            fontFamily: 'var(--font-logo)',
                            fontSize: '1.1rem',
                            textTransform: 'uppercase'
                          }}>
                            {time ? formatDisplayTime(time) : 'SELECT TIME'}
                          </span>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', color: 'var(--color-ink)' }}>
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </button>

                        {showTimePicker && (
                          <div className="co-time-popover">
                            <div className="co-time-list">
                              {timeSlots.map(slot => {
                                const isSelected = time === slot.value;
                                return (
                                  <button
                                    key={slot.value}
                                    type="button"
                                    className={`co-time-option ${isSelected ? 'selected' : ''}`}
                                    onClick={() => {
                                      setTime(slot.value);
                                      setShowTimePicker(false);
                                      setTimeInvalid(false);
                                    }}
                                  >
                                    {slot.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label htmlFor="co-name" className="co-label">Your Name <span className="req">*</span></label>
                    <input
                      id="co-name"
                      type="text"
                      className={`co-input ${nameInvalid ? 'invalid' : ''}`}
                      placeholder="Full name"
                      value={name}
                      onChange={e => {
                        setName(e.target.value);
                        if (e.target.value.trim()) {
                          setNameInvalid(false);
                        }
                      }}
                    />
                  </div>

                  {/* Phone & Email */}
                  <div className="co-row">
                    <div>
                      <label htmlFor="co-phone" className="co-label">Phone <span className="req">*</span></label>
                      <div className={`co-phone-input-wrap ${phoneInvalid ? 'invalid' : ''}`}>
                        <span className="co-phone-prefix">+91</span>
                        <input
                          id="co-phone"
                          type="tel"
                          className="co-input"
                          placeholder="Phone number"
                          value={phone}
                          maxLength={10}
                          onChange={e => {
                            const numericValue = e.target.value.replace(/\D/g, '');
                            if (numericValue.length <= 10) {
                              setPhone(numericValue);
                            }
                            if (numericValue.length === 10) {
                              setPhoneInvalid(false);
                            }
                            setValidationError(null);
                          }}
                          onBlur={() => {
                            if (phone.length > 0 && phone.length !== 10) {
                              setPhoneInvalid(true);
                            } else {
                              setPhoneInvalid(false);
                            }
                          }}
                        />
                      </div>
                      {phoneInvalid && phone.length > 0 && (
                        <div className="co-phone-error-text">
                          * MOBILE NUMBER NEEDS TO BE 10 NUMBERS.
                        </div>
                      )}
                    </div>
                    <div>
                      <label htmlFor="co-email" className="co-label">Email <span className="req">*</span></label>
                      <input
                        id="co-email"
                        type="email"
                        className={`co-input ${emailInvalid ? 'invalid' : ''}`}
                        placeholder="you@email.com"
                        value={email}
                        onChange={e => {
                          setEmail(e.target.value);
                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                          if (e.target.value.trim() && emailRegex.test(e.target.value)) {
                            setEmailInvalid(false);
                          }
                        }}
                      />
                      {emailInvalid && email.trim().length > 0 && (
                        <div className="co-phone-error-text">
                          * PLEASE ENTER A VALID EMAIL ADDRESS.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes for Baker */}
                  <div>
                    <label htmlFor="co-notes" className="co-label">Notes for Baker (Optional)</label>
                    <input
                      id="co-notes"
                      type="text"
                      className="co-input"
                      placeholder="Flavor choices, eggless instructions, allergen alerts..."
                      value={notes}
                      onChange={e => {
                        setNotes(e.target.value);
                        setValidationError(null);
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Error Message Left-Aligned */}
            {currentStep === 1 && descInvalid && (
              <div className="co-phone-error-text" style={{ marginBottom: '12px', textAlign: 'left', fontSize: '0.85rem' }}>
                * PLEASE FILL IN THE REQUIRED FIELDS
              </div>
            )}
            {currentStep === 2 && (dateInvalid || timeInvalid || nameInvalid || (phoneInvalid && phone.length === 0) || (emailInvalid && email.trim().length === 0)) && (
              <div className="co-phone-error-text" style={{ marginBottom: '12px', textAlign: 'left', fontSize: '0.85rem' }}>
                * PLEASE FILL IN THE REQUIRED FIELDS
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="co-nav">
              {currentStep > 1 ? (
                <button type="button" className="co-btn co-btn-back" onClick={prevStep}>Back</button>
              ) : (
                <div />
              )}
              {currentStep < 2 ? (
                <button type="button" className="co-btn co-btn-next" onClick={nextStep}>Next</button>
              ) : (
                <button
                  type="button"
                  className="co-btn co-btn-submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="co-spinner" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Order'
                  )}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  </div>
  );
};
