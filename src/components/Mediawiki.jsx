const errorCode = {
    1: {missing: true, extract: "Improper search query. This is likely a formatting error resulting from Gemini!"},
    2: {missing: true, extract: "Wiki Page does not exist!"}
}

class queryParams {
    constructor(request, keyword) {
        this.action = "query";
        this.format = "json";
        this.origin = "*";
        this.formatversion = "2";
        // Construct parameters for searching a title
        if (request === "search") {
            this.list = "search";
            this.srsearch = keyword;
            this.srlimit = 1;
        // Construct parameters for fetching page source
        } else {
            this.utf8 = "1";
            this.prop = "extracts";
            this.titles = keyword;
            this.explaintext = "1";
            this.redirects = "1";
            if (request === "description") this.exsentences = "3";
        }        
    }
}

// Uses newly created url to fetch the article text, filtering it, and change useState articleText
const getArticle = async (request, keyword, searchUrl) => {
    try {
        // fetch text
        const response = await fetch(searchUrl);
        const data = await response.json();

        // if request is of search type
        if (request === "search") {
            if (data.query.search[0] !== undefined) {
                const article = data.query.search[0].title;
                return {missing: false, extract: article};
            } else {
                throw new Error(`Search query ${keyword} did not turn up any results!`)
            }
        // if request is of page/description fetch type
        } else {
            // if text exists
            if (data.query.pages[0].extract !== undefined) {
                const article = data.query.pages[0].extract;
                let filteredText = article;
                // filter the text
                if (article.match(/(?:.*?(==)+){6}.*?((==)+)/s))
                    filteredText = article.match(/(?:.*?(==)+){6}.*?((==)+)/s).join(" ");
                filteredText = filteredText.replace(/[=]/g, "");
                return {missing: false, extract: filteredText};
            // if text does not exist, throw error for user
            } else {
                throw new Error(`Wiki Page for ${keyword} does not exist!`);
            }
        }
    } catch (error) {
        // change useState extract to error message to give to the bot
        console.error("Error fetching Wiki page: ", error);
        return {missing: true, extract: error.message}
    }
}

export async function callWikipediaAPI(request, keyword) {
    if (!request || ! keyword || !["search", "page", "description"].includes(request)) return errorCode[1];
    const param = new queryParams(request, keyword);
    let newLink = "https://en.wikipedia.org/w/api.php?";
    Object.keys(param).forEach(key => {
        newLink += "&" + key + "=" + encodeURIComponent(param[key]);
    });
    const extract = await getArticle(request, keyword, newLink);
    return extract;
}
