import { NavLink } from '@/models/NavLink';
import { TargetURL } from '@/router';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MyNavLink } from './MyNavLink';

export const NavBar: React.FC = () => {
    const navigate = useNavigate();

    const links: NavLink[] = [
        {
            targetUrl: TargetURL.LOGS,
            title: 'Logs',
        },
    ];

    const navigateHome = () => {
        navigate(TargetURL.HOME);
    };

    return (
        <nav className="sticky top-0 z-20 bg-white flex flex-row min-h-16 items-center justify-between gap-3 px-4 border-b">
            <h2
                onClick={navigateHome}
                className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 hover:cursor-pointer"
            >
                ProcessM.NET
            </h2>
            <div>
                <div className="gap-8">
                    {links.map((link) => {
                        return (
                            <MyNavLink
                                key={link.title}
                                targetUrl={link.targetUrl}
                                title={link.title}
                            />
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};
