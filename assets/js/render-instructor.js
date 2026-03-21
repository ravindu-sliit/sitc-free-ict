(function () {
    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function isRealLink(url) {
        return !!url && url !== "#";
    }

    function listItems(items) {
        if (!Array.isArray(items) || !items.length) {
            return "<li>Details will be updated soon.</li>";
        }
        return items.map(function (item) {
            return "<li>" + escapeHtml(item) + "</li>";
        }).join("");
    }

    function renderSummary(data) {
        var root = document.querySelector("[data-instructor-summary]");
        if (!root) {
            return;
        }

        root.innerHTML = "" +
            "<div class=\"instructor-photo-wrap\">" +
                "<img src=\"" + escapeHtml(data.image) + "\" alt=\"" + escapeHtml(data.name) + "\" class=\"instructor-photo\" loading=\"lazy\" onerror=\"this.style.display='none';this.nextElementSibling.style.display='grid';\">" +
                "<div class=\"instructor-photo-fallback\" style=\"display:none;\">" + escapeHtml((data.name || "I").charAt(0)) + "</div>" +
            "</div>" +
            "<div class=\"instructor-content\">" +
                "<p class=\"instructor-kicker\">Instructor</p>" +
                "<h2>" + escapeHtml(data.name) + "</h2>" +
                "<p class=\"instructor-role\">" + escapeHtml(data.role) + "</p>" +
                "<p class=\"instructor-tagline\">" + escapeHtml(data.tagline) + "</p>" +
                "<p class=\"instructor-bio\">" + escapeHtml(data.shortBio) + "</p>" +
                "<p class=\"instructor-exp\"><strong>Experience:</strong> " + escapeHtml(data.experience) + "</p>" +
                "<div class=\"instructor-actions\">" +
                    (isRealLink(data.email) ? "<a href=\"" + escapeHtml(data.email) + "\" class=\"btn\">Contact Instructor</a>" : "") +
                    "<a href=\"instructor.html\" class=\"btn btn-outline\">View Full Profile</a>" +
                "</div>" +
            "</div>";
    }

    function renderFull(data) {
        var root = document.querySelector("[data-instructor-full]");
        if (!root) {
            return;
        }

        var links = [];
        if (isRealLink(data.email)) {
            links.push("<a href=\"" + escapeHtml(data.email) + "\" class=\"btn\">Email</a>");
        }
        if (isRealLink(data.linkedin)) {
            links.push("<a href=\"" + escapeHtml(data.linkedin) + "\" class=\"btn btn-outline\" target=\"_blank\" rel=\"noopener noreferrer\">LinkedIn</a>");
        }
        if (isRealLink(data.portfolio)) {
            links.push("<a href=\"" + escapeHtml(data.portfolio) + "\" class=\"btn btn-outline\" target=\"_blank\" rel=\"noopener noreferrer\">Portfolio</a>");
        }

        root.innerHTML = "" +
            "<div class=\"instructor-profile\">" +
                "<div class=\"instructor-photo-wrap\">" +
                    "<img src=\"" + escapeHtml(data.image) + "\" alt=\"" + escapeHtml(data.name) + "\" class=\"instructor-photo\" loading=\"lazy\" onerror=\"this.style.display='none';this.nextElementSibling.style.display='grid';\">" +
                    "<div class=\"instructor-photo-fallback\" style=\"display:none;\">" + escapeHtml((data.name || "I").charAt(0)) + "</div>" +
                "</div>" +
                "<div class=\"instructor-content\">" +
                    "<p class=\"instructor-kicker\">Course Instructor</p>" +
                    "<h1>" + escapeHtml(data.name) + "</h1>" +
                    "<p class=\"instructor-role\">" + escapeHtml(data.role) + "</p>" +
                    "<p class=\"instructor-tagline\">" + escapeHtml(data.tagline) + "</p>" +
                    "<p class=\"instructor-bio\">" + escapeHtml(data.fullBio) + "</p>" +
                    "<p class=\"instructor-exp\"><strong>Experience:</strong> " + escapeHtml(data.experience) + "</p>" +
                    "<div class=\"instructor-actions\">" + links.join("") + "</div>" +
                "</div>" +
            "</div>" +
            "<div class=\"instructor-panels\">" +
                "<section class=\"instructor-panel\">" +
                    "<h3>Specialties</h3>" +
                    "<ul>" + listItems(data.specialties) + "</ul>" +
                "</section>" +
                "<section class=\"instructor-panel\">" +
                    "<h3>Credentials</h3>" +
                    "<ul>" + listItems(data.credentials) + "</ul>" +
                "</section>" +
            "</div>";
    }

    async function init() {
        try {
            var response = await fetch("data/instructor.json");
            if (!response.ok) {
                throw new Error("Unable to load instructor data.");
            }

            var data = await response.json();
            renderSummary(data);
            renderFull(data);
        } catch (error) {
            console.error(error);
            var summary = document.querySelector("[data-instructor-summary]");
            var full = document.querySelector("[data-instructor-full]");
            if (summary) {
                summary.innerHTML = "<p style=\"color:#BB1A3E; font-weight:700;\">Instructor details could not be loaded.</p>";
            }
            if (full) {
                full.innerHTML = "<p style=\"color:#BB1A3E; font-weight:700;\">Instructor profile could not be loaded.</p>";
            }
        }
    }

    document.addEventListener("DOMContentLoaded", init);
})();
