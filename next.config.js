/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	images: {
		domains: ['avatars.dicebear.com'],
	},
	async redirects() {
		return [
			{
				source: '/',
				destination: '/home',
				permanent: false,
			},
		];
	},
};

module.exports = nextConfig;
