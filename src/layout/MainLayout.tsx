import Header from 'component/common/Header';
import Footer from 'component/common/footer'
import React from 'react'

interface IMainLayout {
    children: React.ReactNode;
}
function MainLayout({ children }: IMainLayout) {
    return (
        <>
            <Header />
            {
                children
            }
            <Footer />
        </>
    )
}

export default MainLayout