import { useEffect, useState } from "react";

export default function Mediawiki({searchKeyword, setSearchKeyword, articleText, setArticleText}) {
    // (String) url containing the needed parameters dependent on request
    const [url, setUrl] = useState('Waiting on Search...');

    // Base parameters
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

    const getArticle = async () => {
        try {

        } catch (error) {
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