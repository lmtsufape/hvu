import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import FormularioLogin from '@/components/Lapa/LoginLapa';
import { Header02 } from '@/components/Lapa/Header';
import Text from '@/components/Lapa/TextLoginLapa';
import styles from "@/components/LoginForm/index.module.css";
import Footer from "@/components/Lapa/Footer";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

function PageLogin() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.pageWrapper}>
        <Header02 />

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

        <Footer />
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        transition={Slide}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default PageLogin;
