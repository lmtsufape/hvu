import { Header02 } from "@/components/Header";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import Footer from "@/components/Footer";
import "@/styles/styles.css";

function ForgotPasswordPage() {
	return (
		<div className="divPai">
			<Header02 />
			<div className="flexStyle">
				<ForgotPasswordForm />
			</div>
			<Footer />
		</div>
	);
}

export default ForgotPasswordPage;
