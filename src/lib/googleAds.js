import { GoogleAdsApi } from "google-ads-api";

const CACHE_TTL_MS = 15 * 60 * 1000;
const cache = new Map();

function toDateString(date) {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}

function getClient() {
  return new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  });
}

function getCustomer() {
  const client = getClient();
  return client.Customer({
    customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID,
    login_customer_id: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID,
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
  });
}

function money(costMicros) {
  return (costMicros || 0) / 1_000_000;
}

export async function getGoogleAdsOverview(days = 30) {
  const cacheKey = `overview_${days}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  const startStr = toDateString(start);
  const endStr = toDateString(end);
  const dateFilter = `segments.date BETWEEN '${startStr}' AND '${endStr}'`;

  const customer = getCustomer();

  const [totalsRows, dailyRows, campaignRows] = await Promise.all([
    customer.query(`
      SELECT metrics.impressions, metrics.clicks, metrics.cost_micros,
             metrics.conversions, metrics.conversions_value
      FROM customer
      WHERE ${dateFilter}
    `),
    customer.query(`
      SELECT segments.date, metrics.clicks, metrics.cost_micros
      FROM customer
      WHERE ${dateFilter}
      ORDER BY segments.date ASC
    `),
    customer.query(`
      SELECT campaign.id, campaign.name, campaign.status,
             metrics.clicks, metrics.impressions, metrics.cost_micros, metrics.conversions
      FROM campaign
      WHERE ${dateFilter}
      ORDER BY metrics.cost_micros DESC
      LIMIT 10
    `),
  ]);

  const totals = totalsRows[0]?.metrics || {};
  const impressions = totals.impressions || 0;
  const clicks = totals.clicks || 0;
  const cost = money(totals.cost_micros);
  const conversions = totals.conversions || 0;

  const daily = dailyRows.map((row) => ({
    date: row.segments.date,
    clicks: row.metrics.clicks || 0,
    cost: money(row.metrics.cost_micros),
  }));

  const campaigns = campaignRows.map((row) => {
    const campCost = money(row.metrics.cost_micros);
    const campConversions = row.metrics.conversions || 0;
    return {
      id: row.campaign.id,
      name: row.campaign.name,
      status: row.campaign.status,
      clicks: row.metrics.clicks || 0,
      impressions: row.metrics.impressions || 0,
      cost: campCost,
      conversions: campConversions,
      costPerConversion: campConversions > 0 ? campCost / campConversions : null,
    };
  });

  const data = {
    range: { days, start: startStr, end: endStr },
    totals: {
      impressions,
      clicks,
      cost,
      conversions,
      ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
      avgCpc: clicks > 0 ? cost / clicks : 0,
      costPerConversion: conversions > 0 ? cost / conversions : null,
    },
    daily,
    campaigns,
  };

  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}
