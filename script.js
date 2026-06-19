/* ================================================
   BIODATAMAKERS — PREMIUM INTERACTIONS & BUILDER
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Cursor Glow ----
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // ---- Navbar Scrolled States ----
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    }, { passive: true });

    // ---- Mobile Nav Toggle ----
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('#navLinks .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // ---- Scroll Animations ----
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || 0);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                animObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.08,
    });
    document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

    // ---- Counter Animation ----
    function animateCounter(el) {
        const target = parseInt(el.dataset.count);
        if (target === 0) { el.textContent = '0'; return; }
        const duration = 2000;
        const start = performance.now();

        function tick(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4); // ease-out quartic
            el.textContent = Math.round(eased * target);
            if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    const counterSection = document.querySelector('.hero-counters');
    if (counterSection) {
        const counterObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('[data-count]').forEach(c => animateCounter(c));
                    counterObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        counterObs.observe(counterSection);
    }

    // ---- Smooth Scroll ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = navbar ? navbar.offsetHeight + 16 : 80;
                const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    // ---- FAQ Accordion ----
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('toggle', function () {
            if (this.open) {
                document.querySelectorAll('.faq-item').forEach(other => {
                    if (other !== this && other.open) other.open = false;
                });
            }
        });
    });


    /* =========================================================================
       BUILDER APP TRANSITIONS & LOGIC
       ========================================================================= */

    const landingView = document.getElementById('landingView');
    const builderView = document.getElementById('builderView');
    const paperCanvas = document.getElementById('paperCanvas');

    // Toggle views
    function startBuilder() {
        document.body.classList.add('builder-active');
        landingView?.classList.add('hidden');
        builderView?.classList.remove('hidden');
        window.scrollTo(0, 0);
        updateAllFields(); // Populate initially
    }

    function exitBuilder() {
        document.body.classList.remove('builder-active');
        builderView?.classList.add('hidden');
        landingView?.classList.remove('hidden');
    }

    // Click triggers
    document.querySelectorAll('.trigger-builder').forEach(btn => {
        btn.addEventListener('click', startBuilder);
    });
    document.getElementById('btnBackHome')?.addEventListener('click', exitBuilder);


    // ---- Sidebar Tabs ----
    const stepTabs = document.querySelectorAll('.step-tab');
    stepTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            stepTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetPane = tab.dataset.pane;
            document.querySelectorAll('.pane-content').forEach(pane => {
                if (pane.id === targetPane) {
                    pane.classList.remove('hidden');
                } else {
                    pane.classList.add('hidden');
                }
            });
        });
    });


    // ---- Template Switcher ----
    const styleSelectCards = document.querySelectorAll('.style-select-card');
    styleSelectCards.forEach(card => {
        card.addEventListener('click', () => {
            styleSelectCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const templateClass = card.dataset.template;
            // Remove old template classes
            paperCanvas.classList.remove('temp-royal', 'temp-modern', 'temp-floral');
            // Add new class
            paperCanvas.classList.add(templateClass);

            // Handle sidebar/contact structure variations for modern template
            const sidebarCol = document.getElementById('pvSidebarCol');
            const mainColContact = document.getElementById('pvSecContactMain');
            const mainColPhoto = document.getElementById('pvPhotoMain');
            
            if (templateClass === 'temp-modern') {
                sidebarCol.style.display = 'flex';
                if (mainColContact) mainColContact.style.display = 'none';
                if (mainColPhoto) mainColPhoto.style.display = 'none';
            } else {
                sidebarCol.style.display = 'none';
                if (mainColContact) mainColContact.style.display = 'block';
                if (mainColPhoto) mainColPhoto.style.display = 'flex';
            }
        });
    });


    // ---- Color Pickers & Swatches ----
    function setAccentColor(color) {
        paperCanvas.style.setProperty('--pv-accent', color);
        document.getElementById('pickerAccent').value = color;
    }

    function setBgColor(color) {
        paperCanvas.style.setProperty('--pv-bg', color);
        document.getElementById('pickerBg').value = color;
    }

    // Accent Swatches
    const accentSwatches = document.querySelectorAll('#accentSwatches .swatch-item');
    accentSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            accentSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            setAccentColor(swatch.dataset.color);
        });
    });

    document.getElementById('pickerAccent')?.addEventListener('input', (e) => {
        accentSwatches.forEach(s => s.classList.remove('active'));
        setAccentColor(e.target.value);
    });

    // Background Swatches
    const bgSwatches = document.querySelectorAll('#bgSwatches .swatch-item');
    bgSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            bgSwatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            setBgColor(swatch.dataset.color);
        });
    });

    document.getElementById('pickerBg')?.addEventListener('input', (e) => {
        bgSwatches.forEach(s => s.classList.remove('active'));
        setBgColor(e.target.value);
    });


    // ---- Profile Photo Upload Handler ----
    const inPhoto = document.getElementById('inPhoto');
    const photoUploader = document.getElementById('photoUploader');
    const photoPreviewWrap = document.getElementById('photoPreviewWrap');
    const photoPreviewThumbnail = document.getElementById('photoPreviewThumbnail');
    const pvPhotoMain = document.getElementById('pvPhotoMain');
    const pvPhotoSidebar = document.getElementById('pvPhotoSidebar');

    let loadedPhotoData = '';

    inPhoto?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                loadedPhotoData = event.target.result;
                applyPhoto(loadedPhotoData);
            };
            reader.readAsDataURL(file);
        }
    });

    function applyPhoto(dataUrl) {
        if (!dataUrl) return;
        // Apply to preview card frames
        if (pvPhotoMain) {
            pvPhotoMain.style.backgroundImage = `url(${dataUrl})`;
            pvPhotoMain.classList.remove('no-photo');
        }
        if (pvPhotoSidebar) {
            pvPhotoSidebar.style.backgroundImage = `url(${dataUrl})`;
            pvPhotoSidebar.classList.remove('no-photo');
        }
        // Show crop thumbnail and remove button in editor panel
        if (photoPreviewThumbnail) photoPreviewThumbnail.style.backgroundImage = `url(${dataUrl})`;
        photoPreviewWrap?.classList.remove('hidden');
        photoUploader?.classList.add('hidden');
    }

    document.getElementById('btnRemovePhoto')?.addEventListener('click', () => {
        loadedPhotoData = '';
        inPhoto.value = '';
        if (pvPhotoMain) {
            pvPhotoMain.style.backgroundImage = '';
            pvPhotoMain.classList.add('no-photo');
        }
        if (pvPhotoSidebar) {
            pvPhotoSidebar.style.backgroundImage = '';
            pvPhotoSidebar.classList.add('no-photo');
        }
        photoPreviewWrap?.classList.add('hidden');
        photoUploader?.classList.remove('hidden');
    });


    // ---- Form Bindings & Live Preview Updates ----
    const formFields = [
        // Personal Details
        { input: 'inName', preview: 'pvName', container: null },
        { input: 'inDOB', preview: 'pvDob', container: 'pvFieldDob' },
        { input: 'inTime', preview: 'pvTime', container: 'pvFieldTime' },
        { input: 'inPlace', preview: 'pvPlace', container: 'pvFieldPlace' },
        { input: 'inHeight', preview: 'pvHeight', container: 'pvFieldHeight' },
        { input: 'inReligion', preview: 'pvReligion', container: 'pvFieldReligion' },
        { input: 'inMotherTongue', preview: 'pvMotherTongue', container: 'pvFieldMotherTongue' },
        { input: 'inGotra', preview: 'pvGotra', container: 'pvFieldGotra' },
        { input: 'inHoroscope', preview: 'pvHoroscope', container: 'pvFieldHoroscope' },
        
        // Education & Career
        { input: 'inEducation', preview: 'pvEducation', container: 'pvFieldEducation' },
        { input: 'inCollege', preview: 'pvCollege', container: 'pvFieldCollege' },
        { input: 'inJob', preview: 'pvJob', container: 'pvFieldJob' },
        { input: 'inEmployer', preview: 'pvEmployer', container: 'pvFieldEmployer' },
        { input: 'inIncome', preview: 'pvIncome', container: 'pvFieldIncome' },

        // Family Details
        { input: 'inFather', preview: 'pvFather', container: 'pvFieldFather' },
        { input: 'inMother', preview: 'pvMother', container: 'pvFieldMother' },
        { input: 'inBrothers', preview: 'pvBrothers', container: 'pvFieldBrothers' },
        { input: 'inSisters', preview: 'pvSisters', container: 'pvFieldSisters' },
        { input: 'inFamilyType', preview: 'pvFamilyType', container: 'pvFieldFamilyType' },
        { input: 'inFamilyLocation', preview: 'pvFamilyLocation', container: 'pvFieldFamilyLocation' },

        // Hobbies & Expectations
        { input: 'inHobbies', preview: 'pvHobbies', container: 'pvSecHobbies' },
        { input: 'inExpectations', preview: 'pvExpectations', container: 'pvSecExpectations' },

        // Contact details
        { input: 'inContactName', preview: 'pvContactPerson', container: 'pvFieldContactPerson' },
        { input: 'inContactPhone', preview: 'pvContactPhone', container: 'pvFieldContactPhone' },
        { input: 'inContactEmail', preview: 'pvContactEmail', container: 'pvFieldContactEmail' },
        { input: 'inContactAddress', preview: 'pvContactAddress', container: 'pvFieldContactAddress' }
    ];

    function updateLiveField(config) {
        const inputEl = document.getElementById(config.input);
        const previewEl = document.getElementById(config.preview);
        const containerEl = document.getElementById(config.container);

        if (!inputEl) return;

        const value = inputEl.value.trim();

        // 1. Update text content
        if (previewEl) {
            previewEl.textContent = value;
        }

        // Sidebar matches (for Modern layout fields which duplicate contact data)
        if (config.input === 'inContactPhone') {
            const sidePhone = document.querySelector('#pvSidebarPhone span');
            if (sidePhone) sidePhone.textContent = value;
        }
        if (config.input === 'inContactEmail') {
            const sideEmail = document.querySelector('#pvSidebarEmail span');
            if (sideEmail) sideEmail.textContent = value;
        }
        if (config.input === 'inContactName') {
            const sideName = document.querySelector('#pvSidebarContactPerson span');
            if (sideName) sideName.textContent = value;
        }
        if (config.input === 'inContactAddress') {
            const sideAddress = document.querySelector('#pvSidebarAddress span');
            if (sideAddress) sideAddress.textContent = value;
        }

        // 2. Hide container in preview if value is blank to maintain clean templates
        if (containerEl) {
            if (value === '') {
                containerEl.classList.add('hidden');
            } else {
                containerEl.classList.remove('hidden');
            }
        }

        // Check if entire section should be hidden (if all fields in it are empty)
        checkSectionVisibility();
    }

    function checkSectionVisibility() {
        // Personal section check
        const personalInputs = ['inDOB', 'inTime', 'inPlace', 'inHeight', 'inReligion', 'inMotherTongue', 'inGotra', 'inHoroscope'];
        toggleSectionIfEmpty('pvSecPersonal', personalInputs);

        // Career section check
        const careerInputs = ['inEducation', 'inCollege', 'inJob', 'inEmployer', 'inIncome'];
        toggleSectionIfEmpty('pvSecCareer', careerInputs);

        // Family section check
        const familyInputs = ['inFather', 'inMother', 'inBrothers', 'inSisters', 'inFamilyType', 'inFamilyLocation'];
        toggleSectionIfEmpty('pvSecFamily', familyInputs);

        // Contact section check
        const contactInputs = ['inContactName', 'inContactPhone', 'inContactEmail', 'inContactAddress'];
        toggleSectionIfEmpty('pvSecContactMain', contactInputs);
        toggleSectionIfEmpty('pvSidebarContactSec', contactInputs);
    }

    function toggleSectionIfEmpty(sectionId, inputIds) {
        const sectionEl = document.getElementById(sectionId);
        if (!sectionEl) return;

        let hasAnyValue = false;
        inputIds.forEach(id => {
            const val = document.getElementById(id)?.value.trim();
            if (val && val !== '') hasAnyValue = true;
        });

        // Also check if there are custom fields populated in this section
        const customContainer = getCustomFieldsContainerBySectionId(sectionId);
        if (customContainer && customContainer.children.length > 0) {
            hasAnyValue = true;
        }

        if (hasAnyValue) {
            sectionEl.classList.remove('hidden');
        } else {
            sectionEl.classList.add('hidden');
        }
    }

    function getCustomFieldsContainerBySectionId(secId) {
        if (secId === 'pvSecPersonal') return document.getElementById('pvGridPersonal');
        if (secId === 'pvSecCareer') return document.getElementById('pvGridCareer');
        if (secId === 'pvSecFamily') return document.getElementById('pvGridFamily');
        if (secId === 'pvSecContactMain') return document.getElementById('pvGridContactMain');
        return null;
    }

    function updateAllFields() {
        formFields.forEach(updateLiveField);
    }

    // Attach listeners
    formFields.forEach(field => {
        const el = document.getElementById(field.input);
        el?.addEventListener('input', () => updateLiveField(field));
        el?.addEventListener('change', () => updateLiveField(field));
    });


    // ---- Custom Fields Builder System ----
    let customFieldIdCounter = 0;

    function addCustomField(sectionType, gridContainerId, inputsContainerId) {
        const idNum = ++customFieldIdCounter;
        const grid = document.getElementById(gridContainerId);
        const container = document.getElementById(inputsContainerId);

        if (!grid || !container) return;

        // 1. Create Preview Field in Card
        const pvField = document.createElement('div');
        pvField.className = 'temp-field temp-field-custom';
        pvField.id = `pvCustomField_${sectionType}_${idNum}`;
        pvField.innerHTML = `
            <div class="temp-label id-custom-label">Custom Title</div>
            <div class="temp-val id-custom-value">Value</div>
        `;
        grid.appendChild(pvField);

        // 2. Create Input form row in Sidebar
        const formRow = document.createElement('div');
        formRow.className = 'custom-field-row';
        formRow.id = `formCustomField_${sectionType}_${idNum}`;
        formRow.innerHTML = `
            <input type="text" class="custom-title-input" placeholder="Title (e.g. Diet)">
            <input type="text" class="custom-value-input" placeholder="Value (e.g. Vegetarian)">
            <button type="button" class="btn-delete-field">&times;</button>
        `;
        container.appendChild(formRow);

        const titleInput = formRow.querySelector('.custom-title-input');
        const valInput = formRow.querySelector('.custom-value-input');
        const deleteBtn = formRow.querySelector('.btn-delete-field');

        // Bind update listeners
        const updateFn = () => {
            const tVal = titleInput.value.trim();
            const vVal = valInput.value.trim();

            const lbl = pvField.querySelector('.id-custom-label');
            const val = pvField.querySelector('.id-custom-value');

            if (lbl) lbl.textContent = tVal === '' ? 'Custom Title' : tVal;
            if (val) val.textContent = vVal === '' ? 'Value' : vVal;

            // Toggle visibility if empty
            if (tVal === '' && vVal === '') {
                pvField.classList.add('hidden');
            } else {
                pvField.classList.remove('hidden');
            }
            checkSectionVisibility();
        };

        titleInput.addEventListener('input', updateFn);
        valInput.addEventListener('input', updateFn);

        // Delete binder
        deleteBtn.addEventListener('click', () => {
            formRow.remove();
            pvField.remove();
            checkSectionVisibility();
        });

        // Initialize state
        updateFn();
    }

    // Bind add custom field buttons
    document.getElementById('btnAddCustomPersonal')?.addEventListener('click', () => {
        addCustomField('personal', 'pvGridPersonal', 'customPersonalContainer');
    });
    document.getElementById('btnAddCustomCareer')?.addEventListener('click', () => {
        addCustomField('career', 'pvGridCareer', 'customCareerContainer');
    });
    document.getElementById('btnAddCustomFamily')?.addEventListener('click', () => {
        addCustomField('family', 'pvGridFamily', 'customFamilyContainer');
    });
    document.getElementById('btnAddCustomContact')?.addEventListener('click', () => {
        addCustomField('contact', 'pvGridContactMain', 'customContactContainer');
    });


    // ---- Print Handler ----
    document.getElementById('btnPrintPDF')?.addEventListener('click', () => {
        window.print();
    });


    // ---- Save Draft (Download JSON File) ----
    document.getElementById('btnSaveDraft')?.addEventListener('click', () => {
        const draft = {
            styles: {
                template: document.querySelector('.style-select-card.active')?.dataset.template || 'temp-royal',
                accentColor: paperCanvas.style.getPropertyValue('--pv-accent') || '#620023',
                bgColor: paperCanvas.style.getPropertyValue('--pv-bg') || '#fffcf9'
            },
            fields: {},
            customFields: []
        };

        // Standard fields
        formFields.forEach(f => {
            draft.fields[f.input] = document.getElementById(f.input)?.value || '';
        });

        draft.photo = loadedPhotoData;

        // Custom fields serialization
        document.querySelectorAll('.custom-field-row').forEach(row => {
            const parentContainer = row.parentElement;
            let sectionType = 'personal';
            if (parentContainer.id === 'customCareerContainer') sectionType = 'career';
            if (parentContainer.id === 'customFamilyContainer') sectionType = 'family';
            if (parentContainer.id === 'customContactContainer') sectionType = 'contact';

            draft.customFields.push({
                section: sectionType,
                title: row.querySelector('.custom-title-input')?.value || '',
                value: row.querySelector('.custom-value-input')?.value || ''
            });
        });

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(draft, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `marriage_biodata_draft_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });


    // ---- Load Draft (Read JSON File) ----
    const fileSelector = document.createElement('input');
    fileSelector.type = 'file';
    fileSelector.accept = '.json';

    document.getElementById('btnLoadDraft')?.addEventListener('click', () => {
        fileSelector.click();
    });

    fileSelector.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const draft = JSON.parse(event.target.result);
                applyDraft(draft);
            } catch (err) {
                alert('Invalid draft file structure. Please try again.');
            }
        };
        reader.readAsText(file);
    });

    function applyDraft(draft) {
        if (!draft) return;

        // 1. Apply styles
        if (draft.styles) {
            const templateCard = document.querySelector(`.style-select-card[data-template="${draft.styles.template}"]`);
            if (templateCard) {
                templateCard.click();
            }

            if (draft.styles.accentColor) setAccentColor(draft.styles.accentColor);
            if (draft.styles.bgColor) setBgColor(draft.styles.bgColor);
        }

        // 2. Apply photo
        if (draft.photo) {
            loadedPhotoData = draft.photo;
            applyPhoto(loadedPhotoData);
        }

        // 3. Clear existing custom fields
        document.querySelectorAll('.custom-field-row').forEach(row => row.remove());
        document.querySelectorAll('.temp-field-custom').forEach(field => field.remove());

        // 4. Fill standard inputs
        if (draft.fields) {
            for (const inputId in draft.fields) {
                const inputEl = document.getElementById(inputId);
                if (inputEl) {
                    inputEl.value = draft.fields[inputId];
                }
            }
        }

        // 5. Build loaded custom fields
        if (draft.customFields && Array.isArray(draft.customFields)) {
            draft.customFields.forEach(cf => {
                let gridId = 'pvGridPersonal';
                let formContId = 'customPersonalContainer';

                if (cf.section === 'career') { gridId = 'pvGridCareer'; formContId = 'customCareerContainer'; }
                if (cf.section === 'family') { gridId = 'pvGridFamily'; formContId = 'customFamilyContainer'; }
                if (cf.section === 'contact') { gridId = 'pvGridContactMain'; formContId = 'customContactContainer'; }

                const idNum = ++customFieldIdCounter;
                const grid = document.getElementById(gridId);
                const container = document.getElementById(formContId);

                if (grid && container) {
                    // Preview Field in Card
                    const pvField = document.createElement('div');
                    pvField.className = 'temp-field temp-field-custom';
                    pvField.id = `pvCustomField_${cf.section}_${idNum}`;
                    pvField.innerHTML = `
                        <div class="temp-label id-custom-label">${cf.title}</div>
                        <div class="temp-val id-custom-value">${cf.value}</div>
                    `;
                    grid.appendChild(pvField);

                    // Form row
                    const formRow = document.createElement('div');
                    formRow.className = 'custom-field-row';
                    formRow.id = `formCustomField_${cf.section}_${idNum}`;
                    formRow.innerHTML = `
                        <input type="text" class="custom-title-input" value="${cf.title}">
                        <input type="text" class="custom-value-input" value="${cf.value}">
                        <button type="button" class="btn-delete-field">&times;</button>
                    `;
                    container.appendChild(formRow);

                    const titleInput = formRow.querySelector('.custom-title-input');
                    const valInput = formRow.querySelector('.custom-value-input');
                    const deleteBtn = formRow.querySelector('.btn-delete-field');

                    const updateFn = () => {
                        const tVal = titleInput.value.trim();
                        const vVal = valInput.value.trim();
                        const lbl = pvField.querySelector('.id-custom-label');
                        const val = pvField.querySelector('.id-custom-value');
                        if (lbl) lbl.textContent = tVal === '' ? 'Custom Title' : tVal;
                        if (val) val.textContent = vVal === '' ? 'Value' : vVal;
                        if (tVal === '' && vVal === '') {
                            pvField.classList.add('hidden');
                        } else {
                            pvField.classList.remove('hidden');
                        }
                        checkSectionVisibility();
                    };

                    titleInput.addEventListener('input', updateFn);
                    valInput.addEventListener('input', updateFn);
                    deleteBtn.addEventListener('click', () => {
                        formRow.remove();
                        pvField.remove();
                        checkSectionVisibility();
                    });
                }
            });
        }

        // 6. Refresh live previews
        updateAllFields();
        alert('Draft loaded successfully!');
    }

});
