﻿using System.Windows;
using System.Windows.Controls;
using GitHub.Models;
using NullGuard;

namespace GitHub.VisualStudio.UI.Controls
{
    [NullGuard(ValidationFlags.None)]
    public partial class AccountAvatar : UserControl
    {
        public static readonly DependencyProperty AccountProperty =
            DependencyProperty.Register(
                nameof(Account),
                typeof(IAccount),
                typeof(AccountAvatar));

        public AccountAvatar()
        {
            InitializeComponent();
        }

        public IAccount Account
        {
            get { return (IAccount)GetValue(AccountProperty); }
            set { SetValue(AccountProperty, value); }
        }
    }
}
