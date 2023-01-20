import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import usePageLoading from 'hooks/use-page-loading';
import GlobalLoader from 'components/UI/GlobalLoader';

export default function App({ Component, pageProps }: AppProps) {
	const { isPageLoading } = usePageLoading();
	return isPageLoading ? (
		<GlobalLoader />
	) : (
		<SessionProvider>
			<Component {...pageProps} />
		</SessionProvider>
	);
}
