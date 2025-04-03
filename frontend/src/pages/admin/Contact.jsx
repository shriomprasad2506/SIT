import { useEffect, useState } from "react";

import ContactList from "../../components/admin/Contact/ContactList";
import NewsForm from "../../components/admin/Contact/NewsForm";
const Contact = () => {
    useEffect(() => {
        document.title = "SIT | Contact";
    }, []);

    const [formModal, setFormModal] = useState(false);
    const formOpen = () => setFormModal(true);
    const formClose = () => setFormModal(false);
    const [refresh, setRefresh] = useState(false);

    return (
        <div className="md:p-5 p-3">
            <p className="text-3xl font-semibold text-black">Contact</p>
            <ContactList refresh={refresh} setRefresh={setRefresh} />
            <NewsForm isOpen={formModal} onClose={formClose} setRefresh={setRefresh} />
        </div>
    )
}
export default Contact