(() => {
    function showToast(message, variant = "success") {
        const root = document.getElementById("toastRoot");
        if (!root) return;

        const el = document.createElement("div");
        el.className = `toast-item ${variant}`;
        el.textContent = message;
        root.appendChild(el);
        setTimeout(() => {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, 2800);
    }

    function setupThemeToggle() {
        const themeToggle = document.getElementById("themeToggle");
        if (!themeToggle) return;
        const key = "portal_theme_mode";
        const saved = localStorage.getItem(key);
        if (saved === "light") document.body.classList.add("light-mode");

        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            const next = document.body.classList.contains("light-mode") ? "light" : "dark";
            localStorage.setItem(key, next);
            showToast(`Theme switched to ${next} mode`, "success");
        });
    }

    async function renderCourseChart() {
        const canvas = document.getElementById("courseChart");
        const loading = document.getElementById("chartLoading");
        if (!canvas || typeof Chart === "undefined") return;

        try {
            const response = await fetch("/api/analytics/");
            if (!response.ok) throw new Error("Analytics request failed");
            const data = await response.json();
            const distribution = data.course_distribution || {};
            const labels = Object.keys(distribution);
            const values = Object.values(distribution);

            if (loading) loading.style.display = "none";
            if (labels.length === 0) {
                const empty = document.createElement("div");
                empty.className = "empty-state";
                empty.textContent = "No course data yet. Add/import students to see chart insights.";
                canvas.insertAdjacentElement("beforebegin", empty);
                canvas.style.display = "none";
                return;
            }

            new Chart(canvas, {
                type: "doughnut",
                data: {
                    labels,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: [
                                "#6366f1",
                                "#3b82f6",
                                "#06b6d4",
                                "#14b8a6",
                                "#8b5cf6",
                                "#f59e0b",
                                "#10b981",
                                "#f97316",
                            ],
                            borderColor: "rgba(255,255,255,0.25)",
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    plugins: {
                        legend: {
                            labels: {
                                color: getComputedStyle(document.body).getPropertyValue("--text-main") || "#e5e7eb",
                            },
                        },
                    },
                },
            });
        } catch (_err) {
            if (loading) loading.style.display = "none";
            showToast("Could not load analytics chart right now.", "warn");
        }
    }

    function setupSavedFilters() {
        const form = document.getElementById("studentSearchForm");
        if (!form) return;
        const qInput = form.querySelector('input[name="q"]');
        const course = form.querySelector('select[name="course"]');
        const status = form.querySelector('select[name="status"]');
        const year = form.querySelector('select[name="year"]');
        const hasPhone = form.querySelector('select[name="has_phone"]');
        const sort = form.querySelector('select[name="sort"]');
        const perPage = form.querySelector('select[name="per_page"]');
        const saveBtn = document.getElementById("saveCurrentFilter");
        const loadBtn = document.getElementById("loadSavedFilter");
        const clearBtn = document.getElementById("clearSavedFilter");
        const key = "portal_saved_filter";

        function save() {
            const payload = {
                q: qInput ? qInput.value : "",
                course: course ? course.value : "",
                status: status ? status.value : "",
                year: year ? year.value : "",
                has_phone: hasPhone ? hasPhone.value : "",
                sort: sort ? sort.value : "",
                per_page: perPage ? perPage.value : "8",
            };
            localStorage.setItem(key, JSON.stringify(payload));
            showToast("Filter saved locally.", "success");
        }

        function load() {
            const raw = localStorage.getItem(key);
            if (!raw) {
                showToast("No saved filter found.", "warn");
                return;
            }
            try {
                const payload = JSON.parse(raw);
                if (qInput) qInput.value = payload.q || "";
                if (course) course.value = payload.course || "";
                if (status) status.value = payload.status || "";
                if (year) year.value = payload.year || "";
                if (hasPhone) hasPhone.value = payload.has_phone || "";
                if (sort) sort.value = payload.sort || "name";
                if (perPage) perPage.value = payload.per_page || "8";
                form.submit();
            } catch (_err) {
                showToast("Saved filter data is invalid.", "error");
            }
        }

        if (saveBtn) saveBtn.addEventListener("click", save);
        if (loadBtn) loadBtn.addEventListener("click", load);
        if (clearBtn) clearBtn.addEventListener("click", () => {
            localStorage.removeItem(key);
            showToast("Saved filter cleared.", "success");
        });
    }

    function setupQuickPresets() {
        const form = document.getElementById("studentSearchForm");
        if (!form) return;
        const qInput = form.querySelector('input[name="q"]');
        const status = form.querySelector('select[name="status"]');
        const year = form.querySelector('select[name="year"]');
        const hasPhone = form.querySelector('select[name="has_phone"]');
        const sort = form.querySelector('select[name="sort"]');

        function applyPreset(config) {
            if (qInput) qInput.value = config.q || "";
            if (status) status.value = config.status || "";
            if (year) year.value = config.year || "";
            if (hasPhone) hasPhone.value = config.has_phone || "";
            if (sort) sort.value = config.sort || "name";
            form.submit();
        }

        const activeBtn = document.getElementById("presetActive");
        const alumniBtn = document.getElementById("presetAlumni");
        const year1Btn = document.getElementById("presetYear1");
        const recentBtn = document.getElementById("presetRecent");
        const missingPhoneBtn = document.getElementById("presetMissingPhone");

        if (activeBtn) activeBtn.addEventListener("click", () => applyPreset({ q: "", status: "active" }));
        if (alumniBtn) alumniBtn.addEventListener("click", () => applyPreset({ q: "", status: "alumni" }));
        if (year1Btn) year1Btn.addEventListener("click", () => applyPreset({ q: "", status: "", year: "1" }));
        if (recentBtn) recentBtn.addEventListener("click", () => applyPreset({ q: "", status: "", year: "", sort: "-updated_at" }));
        if (missingPhoneBtn) missingPhoneBtn.addEventListener("click", () => applyPreset({ q: "", has_phone: "no" }));
    }

    function setupBulkSelectionUX() {
        const selectAll = document.getElementById("selectAllStudents");
        const rowChecks = Array.from(document.querySelectorAll(".student-select"));
        const summary = document.getElementById("selectionSummary");
        const bulkForm = document.querySelector('form[action*="bulk-delete"]');
        const statusSelect = document.getElementById("bulkStatusSelect");
        if (!summary || rowChecks.length === 0) return;

        function renderCount() {
            const selected = rowChecks.filter((c) => c.checked).length;
            summary.textContent = `${selected} students selected.`;
            if (selectAll) selectAll.checked = selected > 0 && selected === rowChecks.length;
        }

        if (selectAll) {
            selectAll.addEventListener("change", () => {
                rowChecks.forEach((c) => {
                    c.checked = selectAll.checked;
                });
                renderCount();
            });
        }

        rowChecks.forEach((c) => c.addEventListener("change", renderCount));
        renderCount();

        if (bulkForm) {
            bulkForm.addEventListener("submit", (e) => {
                const selected = rowChecks.filter((c) => c.checked).length;
                const submitter = e.submitter;
                const usesStatusAction =
                    submitter &&
                    submitter.getAttribute("formaction") &&
                    submitter.getAttribute("formaction").includes("bulk-status");
                if (selected === 0) {
                    e.preventDefault();
                    showToast("Select at least one student first.", "warn");
                    return;
                }
                if (usesStatusAction) {
                    if (!statusSelect || !statusSelect.value) {
                        e.preventDefault();
                        showToast("Choose a status to apply.", "warn");
                    }
                    return;
                }
                const ok = window.confirm(`Delete ${selected} selected students?`);
                if (!ok) e.preventDefault();
            });
        }
    }

    function setupTableDensityToggle() {
        const btn = document.getElementById("toggleDensity");
        const table = document.getElementById("studentsTable");
        if (!btn || !table) return;

        const key = "portal_table_density";
        const saved = localStorage.getItem(key);
        if (saved === "compact") {
            table.classList.remove("table-density-comfort");
            table.classList.add("table-density-compact");
            btn.textContent = "Comfort";
        }

        btn.addEventListener("click", () => {
            const isCompact = table.classList.contains("table-density-compact");
            if (isCompact) {
                table.classList.remove("table-density-compact");
                table.classList.add("table-density-comfort");
                localStorage.setItem(key, "comfort");
                btn.textContent = "Compact";
            } else {
                table.classList.remove("table-density-comfort");
                table.classList.add("table-density-compact");
                localStorage.setItem(key, "compact");
                btn.textContent = "Comfort";
            }
        });
    }

    function setupOnboardingTip() {
        const dashboard = document.getElementById("studentSearchForm");
        if (!dashboard) return;
        const key = "portal_tip_dismissed";
        if (localStorage.getItem(key) === "1") return;

        const card = document.createElement("div");
        card.className = "onboarding-tip";
        card.innerHTML = `
            <span>Welcome! Try quick presets, save filters, and use keyboard shortcuts: /, n, c.</span>
            <button type="button" class="mini-btn" id="dismissOnboarding">Got it</button>
        `;
        dashboard.parentNode.insertBefore(card, dashboard);
        const dismissBtn = card.querySelector("#dismissOnboarding");
        dismissBtn.addEventListener("click", () => {
            localStorage.setItem(key, "1");
            card.remove();
        });
    }

    function setupShortcuts() {
        const searchInput = document.getElementById("searchInput");
        document.addEventListener("keydown", (e) => {
            if (e.target && ["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
            if (e.key === "/") {
                e.preventDefault();
                if (searchInput) searchInput.focus();
            } else if (e.key.toLowerCase() === "n") {
                const addLink = document.querySelector('a[href*="/students/add/"]');
                if (addLink) window.location.href = addLink.href;
            } else if (e.key.toLowerCase() === "c") {
                const chatToggle = document.getElementById("supportChatToggle");
                if (chatToggle) chatToggle.click();
            }
        });
    }

    function setupQueryToasts() {
        const params = new URLSearchParams(window.location.search);
        if (params.has("created")) showToast("Student created successfully.", "success");
        if (params.has("updated")) showToast("Student updated successfully.", "success");
        if (params.has("deleted")) showToast("Record deleted successfully.", "success");
        if (params.has("duplicated")) showToast("Student duplicated successfully.", "success");
        if (params.has("bulk_deleted")) {
            showToast(`${params.get("bulk_deleted")} students deleted.`, "success");
        }
        if (params.has("bulk_updated")) {
            const updated = params.get("bulk_updated");
            const status = params.get("status") || "updated";
            showToast(`${updated} students marked as ${status}.`, "success");
        }
        if (params.has("preset_saved")) showToast("Filter preset saved to your account.", "success");
        if (params.has("preset_deleted")) showToast("Filter preset deleted.", "success");
        if (params.has("results_published")) showToast("Results published successfully.", "success");
        if (params.has("submitted")) showToast("Assignment submitted.", "success");
        if (params.has("graded")) showToast("Submission graded.", "success");
        if (params.has("announced")) showToast("Announcement posted.", "success");
        if (params.has("imported")) {
            const created = params.get("created") || "0";
            const updated = params.get("updated") || "0";
            showToast(`CSV import done: ${created} created, ${updated} updated.`, "success");
        }
    }

    async function requestAI(message) {
        const response = await fetch("/api/support-chat/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || data.reply || "AI request failed.");
        return data.reply || "No response generated.";
    }

    function setupAIToolPanel() {
        const toolButtons = Array.from(document.querySelectorAll(".ai-tool-btn"));
        const output = document.getElementById("aiToolOutput");
        const copyBtn = document.getElementById("aiToolCopy");
        if (!toolButtons.length || !output) return;

        toolButtons.forEach((btn) => {
            btn.addEventListener("click", async () => {
                const prompt = btn.getAttribute("data-ai-prompt") || "";
                if (!prompt) return;
                const oldText = btn.textContent;
                btn.disabled = true;
                btn.textContent = "Generating...";
                output.textContent = "Thinking...";
                try {
                    const ctx = getCurrentDashboardFilters();
                    const reply = await requestAI(`${prompt}\n\nCurrent dashboard filters:\n${ctx}`);
                    output.textContent = reply;
                    showToast("AI output generated.", "success");
                } catch (err) {
                    output.textContent = err.message || "Failed to generate AI output.";
                    showToast("AI generation failed.", "error");
                } finally {
                    btn.disabled = false;
                    btn.textContent = oldText;
                }
            });
        });

        if (copyBtn) {
            copyBtn.addEventListener("click", async () => {
                try {
                    await navigator.clipboard.writeText(output.textContent || "");
                    showToast("AI output copied.", "success");
                } catch (_err) {
                    showToast("Copy failed.", "error");
                }
            });
        }
    }

    function getCurrentDashboardFilters() {
        const qInput = document.querySelector('#studentSearchForm input[name="q"]');
        const courseSel = document.querySelector('#studentSearchForm select[name="course"]');
        const statusSel = document.querySelector('#studentSearchForm select[name="status"]');
        const yearSel = document.querySelector('#studentSearchForm select[name="year"]');
        const phoneSel = document.querySelector('#studentSearchForm select[name="has_phone"]');
        const sortSel = document.querySelector('#studentSearchForm select[name="sort"]');
        const q = qInput ? qInput.value : "";
        const course = courseSel ? courseSel.value : "";
        const status = statusSel ? statusSel.value : "";
        const year = yearSel ? yearSel.value : "";
        const hasPhone = phoneSel ? phoneSel.value : "";
        const sort = sortSel ? sortSel.value : "";
        return `q=${q || "(none)"}; course=${course || "(all)"}; status=${status || "(all)"}; year=${year || "(all)"}; phone=${hasPhone || "(any)"}; sort=${sort || "(default)"}`;
    }

    setupThemeToggle();
    setupSavedFilters();
    setupQuickPresets();
    setupBulkSelectionUX();
    setupTableDensityToggle();
    setupOnboardingTip();
    setupShortcuts();
    setupQueryToasts();
    setupAIToolPanel();
    renderCourseChart();
    window.portalToast = showToast;
})();
