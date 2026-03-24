(function () {
    var SESSION_DATA_VERSION = "2026-03-24";

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function normalizeUrl(url) {
        if (!url) {
            return "#";
        }
        return url;
    }

    function sanitizeClassToken(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
    }

    function buildCard(session) {
        var moduleClass = "card--module-" + sanitizeClassToken(session.module);
        var cardClass = session.isAssignment ? "card " + moduleClass + " card--assignment" : "card " + moduleClass;
        var titleClass = session.isAssignment ? "card-title card-title--assignment" : "card-title";
        var videoUrl = normalizeUrl(session.videoUrl);
        var pdfUrl = normalizeUrl(session.pdfUrl);

        return "" +
            "<div class=\"" + cardClass + "\">" +
                "<h3 class=\"" + titleClass + "\">" + escapeHtml(session.sessionNumber + ": " + session.title) + "</h3>" +
                "<p>" + escapeHtml(session.description) + "</p>" +
                "<div class=\"card-footer\">" +
                    "<div class=\"card-actions\">" +
                        "<a href=\"" + escapeHtml(videoUrl) + "\" class=\"btn btn-video\" style=\"padding: 8px 15px; font-size: 0.9rem;\" target=\"_blank\" rel=\"noopener noreferrer\">Watch Video</a>" +
                        "<a href=\"" + escapeHtml(pdfUrl) + "\" class=\"btn\" style=\"padding: 8px 15px; font-size: 0.9rem;\" target=\"_blank\" rel=\"noopener noreferrer\">Download PDF</a>" +
                    "</div>" +
                "</div>" +
            "</div>";
    }

    function setError(grid, message) {
        grid.innerHTML = "<p style=\"color:#BB1A3E; font-weight:700;\">" + escapeHtml(message) + "</p>";
    }

    async function renderCards() {
        var grid = document.querySelector("[data-sessions-grid]");
        if (!grid) {
            return;
        }

        var moduleKey = grid.getAttribute("data-module");
        if (!moduleKey) {
            setError(grid, "Module key is missing.");
            return;
        }

        try {
            var response = await fetch("data/sessions.json?v=" + encodeURIComponent(SESSION_DATA_VERSION));
            if (!response.ok) {
                throw new Error("Unable to load sessions.json");
            }

            var payload = await response.json();
            var sessions = Array.isArray(payload.sessions) ? payload.sessions : [];
            var filtered = sessions.filter(function (item) {
                return item.module === moduleKey;
            });

            filtered.sort(function (a, b) {
                return (a.order || 0) - (b.order || 0);
            });

            if (!filtered.length) {
                grid.innerHTML = "<p>No sessions published yet for this module.</p>";
                return;
            }

            grid.innerHTML = filtered.map(buildCard).join("");
        } catch (error) {
            setError(grid, "Could not load session data.");
            console.error(error);
        }
    }

    document.addEventListener("DOMContentLoaded", renderCards);
})();
