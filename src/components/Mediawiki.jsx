import { useEffect, useState } from "react";

export default function Mediawiki({searchKeyword, setArticleText}) {
    
    // (String) url containing the needed parameters dependent on request
    const [url, setUrl] = useState('Waiting on Search...');

    // Base parameters for url
    const params = {
        action: "query",
        format: "json",
        prop: "extracts",
        titles: searchKeyword.keyword,
        utf8: "1",
        formatversion: "2",
        explaintext: "1",
        origin: "*",
        redirects: "1"
    }

    // Takes in: params, changes params with additional key value pair without returning anything
    const setParam = (params) => {
        if (searchKeyword.request === "description") {
            params.exsentences = "3";
        }
    }

    // Takes in nothing, updates url using setUrl with parameters being added to link
    const addUrlParams = () => {
        let newLink = "https://en.wikipedia.org/w/api.php?";

        Object.keys(params).forEach(key => {
            newLink += "&" + key + "=" + encodeURIComponent(params[key]);
        });

        setUrl(newLink);
    }

    // Uses newly created url to fetch the article text, filtering it, and change useState articleText
    const getArticle = async () => {
        try {
            // fetch text
            const response = await fetch(url);
            const data = await response.json();

            // if text exists
            if (data.query.pages[0].extract !== undefined) {
                const article = data.query.pages[0].extract;
                // If request is a search, filter the text
                if (searchKeyword.request === "search") {
                    const filteredText = article.match(/(?:.*?(==)+){6}.*?((==)+)/s);
                    // If filteredText is true (article must have 3 or more sections) change useState else use normal pre-filter text.
                    if (filteredText) {
                        setArticleText({missing: false, extract: filteredText[0]});
                    } else {
                        setArticleText({missing: false, extract: article});
                    }
                // if request is a description, change useState
                } else if (searchKeyword.request === "description") {
                    setArticleText({missing: false, extract: article});
                }
            // if text does not exist, throw error for user
            } else if (data.query.pages[0].missing) {
                throw new Error(`Wiki Page for ${searchKeyword.keyword} does not exist!`);
            }
        } catch (error) {
            // change useState extract to error message to give to the bot
            setArticleText({missing: true, extract: error.message});
            console.error("Error fetching Wiki page: ", error);
        }
    }

    // Calls when keyword gets changed, use this to communicate with Gemini.jsx(Having gemini change the keyword to what the user said will call this)
    useEffect (() => {
        {/* Option Chaining so useEffect is not used when initially defined as empty */}
        if (searchKeyword?.request === '' || searchKeyword?.keyword === '') {
            return
        }
        else {
            setParam(params);
            addUrlParams();
        }
    }, [keyword])

    // Once url is changed to new url it calls this useEffect to start fetch with getArticle(). 
    useEffect(() => {
        {/* Option Chaining so useEffect is not used when initially defined as empty */}
        if (url !== 'Waiting on Search...') {
            getArticle(url);
        }
    }, [url])

}