const Stats = (links) => {
    const totalLinks = links.length;
    const uniqueLinks = [...new Set(links.map((allLinks) => allLinks.href))].length;
    return { total: totalLinks, unique: uniqueLinks };
};

const getStats = (links) => { 
    const totalLinks = links.length;
    const uniqueLinks = [...new Set(links.map((allLinks) => allLinks.href))].length;
    const brokenLinks = links.filter((element) => element.ok === 'Fail').length;
    return { total: totalLinks, unique: uniqueLinks, broken: brokenLinks};  
    
};

module.exports = {
    Stats,
    getStats
};