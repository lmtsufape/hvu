import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import FormularioLogin from '@/components/Lapa/LoginLapa';
import { Header02 } from '@/components/Lapa/Header';
import Text from '../../src/components/Lapa/TextLoginLapa';
import styles from "@/components/LoginForm/index.module.css";
import Footer from "@/components/Lapa/Footer";

const queryClient = new QueryClient();

function PageLogin() {
    return (
        <div>
            <QueryClientProvider client={queryClient}>
                <div>
                    <Header02 />
                </div>

                <div className={styles.container}>
                    <div className={styles.container_box}>
                        <div className={styles.text_box}>
                            <Text />
                        </div>

                        <div className={styles.form_box}>
                            <h1>Entrar</h1>
                            <form>
                                <FormularioLogin />
                            </form>
                        </div>
                    </div>
                </div>

                <div>
                    <Footer />
                </div>
                <ReactQueryDevtools />
            </QueryClientProvider>
        </div>
    );
}

export default PageLogin;
