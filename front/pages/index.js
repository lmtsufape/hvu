import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import FormularioLogin from "../src/components/LoginForm";
import { Header02 } from "../src/components/Header";
import Text from "../src/components/TextLogin";
import styles from "../src/components/LoginForm/index.module.css";
import Footer from "@/components/Footer";
import "@/styles/styles.css";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

function PageLogin() {
  return (
    <div className="divPai">
      <QueryClientProvider client={queryClient}>
        <div>
          <Header02 />
        </div>

        <div className={(styles.container, "flexStyle")}>
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
    </div>
  );
}

export default PageLogin;
