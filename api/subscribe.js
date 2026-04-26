module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, first_name } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email required' });

  const pubId = process.env.BEEHIIV_PUBLICATION_ID;
  const apiKey = process.env.BEEHIIV_API_KEY;
  console.log('pub_id present:', !!pubId, '| api_key present:', !!apiKey);

  const payload = { email, reactivate_existing: false, tags: ['design index'] };
  if (first_name) payload.custom_fields = [{ name: 'first_name', value: first_name }];

  const response = await fetch(
    `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await response.json().catch(() => ({}));
  console.log('beehiiv status:', response.status, '| body:', JSON.stringify(data));

  if (!response.ok) {
    return res.status(response.status).json({ error: data });
  }

  return res.status(200).json({ success: true });
};
